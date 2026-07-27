import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { sendTokenCookie } from '../utils/generateToken.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

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
      res.status(400).json({ message: `The email '${email}' is already registered` });
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
        profilePicture: user.profilePicture || '',
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private (Authenticated)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Set expiry in the past to delete the cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get current user details
// @route   GET /api/auth/me
// @access  Private (Authenticated)
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Mock OAuth login/signup
// @route   POST /api/auth/oauth-mock
// @access  Public
export const oauthMock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider } = req.body;
    if (!provider || (provider !== 'google' && provider !== 'github')) {
      res.status(400).json({ message: 'Invalid provider' });
      return;
    }

    const email = `${provider}-tester@guildcode.com`;
    const fullName = provider === 'google' ? 'Google Tester' : 'GitHub Tester';

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create user pre-approved and active
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('oauth_mock_password_secure_123', salt);

      user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        status: 'active',
        isActive: true,
        joinDate: new Date(),
        role: 'member',
      });
    } else {
      // Ensure user is active and approved if already exists
      if (user.status === 'suspended') {
        res.status(403).json({ message: 'Your account has been suspended' });
        return;
      }
      if (user.status !== 'active') {
        user.status = 'active';
        user.isActive = true;
        await user.save();
      }
    }

    // Generate token and set cookie
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
        profilePicture: user.profilePicture || '',
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
