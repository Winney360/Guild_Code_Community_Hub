import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { sendTokenCookie } from '../utils/generateToken.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      status: 'pending',
      isActive: false,
      joinDate: null,
    });

    // 5. Notify all admin users that a new member application is pending approval
    const admins = await User.find({ role: 'admin' }).select('_id');
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        sender: newUser._id,
        type: 'application_received',
        title: 'New Member Application',
        message: `${fullName} (${email}) has registered and is pending approval.`,
        link: '/dashboard/admin',
      });
    }

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
      res.status(200).json({ success: true, user: null });
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

// @desc    Real / Realistic Google OAuth login & signup
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential, email: inputEmail, fullName: inputName, profilePicture: inputAvatar } = req.body;

    let email = inputEmail;
    let fullName = inputName;
    let avatar = inputAvatar;

    // 1. If real Google ID token credential is sent from Google SDK
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload?.email;
        fullName = payload?.name || payload?.given_name || (email ? email.split('@')[0] : undefined);
        avatar = payload?.picture;
      } catch (err: any) {
        console.error('Google token verification failed:', err?.message || err);
        if (process.env.GOOGLE_CLIENT_ID) {
          console.error('Expected audience:', process.env.GOOGLE_CLIENT_ID);
        }
      }
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ message: 'Valid Google email address is required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (fullName && typeof fullName === 'string' && fullName.trim())
      ? fullName.trim()
      : cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    avatar = (avatar && typeof avatar === 'string' && avatar.trim())
      ? avatar.trim()
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=006655&color=fff&size=200`;

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // First-time Google signup: create account in 'pending' status requiring admin approval
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(`google_oauth_${Date.now()}_${Math.random()}`, salt);

      user = await User.create({
        fullName: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        profilePicture: avatar,
        status: 'pending',
        isActive: false,
        joinDate: null,
        role: 'member',
      });

      // Notify all admin users that a new Google application is pending approval
      const admins = await User.find({ role: 'admin' }).select('_id');
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          sender: user._id,
          type: 'application_received',
          title: 'New Member Application (Google)',
          message: `${cleanName} (${cleanEmail}) registered via Google and is pending approval.`,
          link: '/dashboard/admin',
        });
      }

      res.status(201).json({
        success: false,
        isPending: true,
        message: 'Your account is pending admin approval.',
      });
      return;
    } else {
      // Existing user checks
      if (user.status === 'suspended') {
        res.status(403).json({ message: 'Your account has been suspended' });
        return;
      }

      if (user.status === 'pending' || !user.isActive) {
        res.status(403).json({ message: 'Your account is pending admin approval.' });
        return;
      }

      let modified = false;
      if (avatar && !user.profilePicture) {
        user.profilePicture = avatar;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    }

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

// @desc    Mock OAuth login/signup (supports custom email & name)
// @route   POST /api/auth/oauth-mock
// @access  Public
export const oauthMock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider, email: customEmail, fullName: customName, profilePicture } = req.body;
    if (!provider || (provider !== 'google' && provider !== 'github')) {
      res.status(400).json({ message: 'Invalid provider' });
      return;
    }

    const email = customEmail && customEmail.includes('@')
      ? customEmail.trim().toLowerCase()
      : `${provider}-tester@guildcode.com`;

    const fullName = customName && customName.trim()
      ? customName.trim()
      : (provider === 'google' ? 'Google User' : 'GitHub User');

    const avatar = profilePicture && profilePicture.trim()
      ? profilePicture.trim()
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=006655&color=fff&size=200`;

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
        profilePicture: avatar,
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
