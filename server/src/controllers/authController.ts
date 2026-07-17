import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { sendTokenCookie } from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // 1. Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in database (Spec 3.2: status 'pending', isActive false, joinDate null)
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      status: 'pending',
      isActive: false,
      joinDate: null,
    });

    // Spec 4.2: Show message "Your account is pending admin approval" and do NOT login automatically
    res.status(201).json({
      success: true,
      message: 'Your account is pending admin approval.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Find user and explicitly select password (which is excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Spec 3.3: Pending account blocks login with 403
    if (user.status === 'pending' || !user.isActive) {
      res.status(403).json({ message: 'Your account is awaiting admin approval' });
      return;
    }

    // Spec 3.3: Suspended account blocks login with 403
    if (user.status === 'suspended') {
      res.status(403).json({ message: 'Your account has been suspended' });
      return;
    }

    // On success: Generate JWT token and save it to an httpOnly cookie
    sendTokenCookie(user._id.toString(), user.role, res);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
