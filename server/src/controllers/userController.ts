import { Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// @desc    Get all active members (Members Page)
// @route   GET /api/users
// @access  Public
export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Spec 4.4: Displays only approved, active members
    const users = await User.find({ isActive: true, status: 'active' });
    
    // Fetch project count for each member
    const usersWithProjectCount = await Promise.all(
      users.map(async (user) => {
        const projectCount = await Project.countDocuments({ byUser: user._id, isVisible: true });
        return {
          ...user.toObject(),
          projectCount,
        };
      })
    );

    res.status(200).json({ success: true, count: usersWithProjectCount.length, data: usersWithProjectCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single member profile
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Member profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update own profile fields
// @route   PATCH /api/users/:id
// @access  Private (Own profile)
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Spec 8.2: Update own profile fields only
    if (req.user?.id !== req.params.id) {
      res.status(403).json({ message: 'You can only update your own profile' });
      return;
    }

    const {
      fullName,
      specializations,
      location,
      linkedin,
      github,
      skills,
      bio,
      profilePicture,
    } = req.body;

    // Spec 9.1: Bio limit is 300 characters
    if (bio && bio.length > 300) {
      res.status(400).json({ message: 'Bio cannot exceed 300 characters' });
      return;
    }

    const updateFields: any = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (specializations !== undefined) updateFields.specializations = specializations;
    if (location !== undefined) updateFields.location = location;
    if (linkedin !== undefined) updateFields.linkedin = linkedin;
    if (github !== undefined) updateFields.github = github;
    if (skills !== undefined) updateFields.skills = skills;
    if (bio !== undefined) updateFields.bio = bio;
    if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Change own password
// @route   PATCH /api/users/:id/password
// @access  Private (Own profile)
export const updatePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.id !== req.params.id) {
      res.status(403).json({ message: 'You can only change your own password' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Please provide current and new password' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters' });
      return;
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// ================= ADMIN ACTIONS =================

// @desc    Get all users including pending (Admin only)
// @route   GET /api/users/admin/users (mapped in router)
// @access  Private (Admin)
export const adminGetUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Approve pending member
// @route   PATCH /api/users/admin/users/:id/approve
// @access  Private (Admin)
export const adminApproveUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Spec 3.2.4: approve -> isActive: true, status: 'active', joinDate: Date.now()
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.isActive = true;
    user.status = 'active';
    user.joinDate = new Date();
    await user.save();

    res.status(200).json({ success: true, message: 'User approved successfully', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Suspend member
// @route   PATCH /api/users/admin/users/:id/suspend
// @access  Private (Admin)
export const adminSuspendUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Spec 6.2: Suspend -> sets status to 'suspended', blocks login
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.status = 'suspended';
    await user.save();

    res.status(200).json({ success: true, message: 'User suspended successfully', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Hard delete user + cascade (Admin only)
// @route   DELETE /api/users/admin/users/:id
// @access  Private (Admin)
export const adminDeleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id as string);

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const db = mongoose.connection.db;

    // Spec 9.2: Hard Delete Cascade
    if (db) {
      // Delete all Projects where byUser === userId
      await db.collection('projects').deleteMany({ byUser: userId });
      // Delete all Collaborations where postedBy === userId
      await db.collection('collaborations').deleteMany({ postedBy: userId });
      // Delete all Applications where applicantId === userId
      await db.collection('applications').deleteMany({ applicantId: userId });
      // Delete all Comments where userId === userId
      await db.collection('comments').deleteMany({ userId: userId });
      // Delete all Notifications where userId === userId
      await db.collection('notifications').deleteMany({ userId: userId });
    }

    // Delete the User document itself
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User and all associated content hard deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
