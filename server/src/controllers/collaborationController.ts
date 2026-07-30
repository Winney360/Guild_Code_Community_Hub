import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Collaboration } from '../models/Collaboration.js';
import { Application as ApplicationModel } from '../models/Application.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { Comment } from '../models/Comment.js';

// @desc    Get all open collaborations
// @route   GET /api/collaborations
// @access  Public
export const getCollaborations = async (req: Request, res: Response): Promise<void> => {
  try {
    const collaborations = await Collaboration.find({ status: 'open' })
      .populate('byUser', 'fullName profilePicture')
      .sort({ createdAt: -1 });

    const updatedCollaborations = await Promise.all(
      collaborations.map(async (collab) => {
        const commentsCount = await Comment.countDocuments({ collaborationId: collab._id });
        const applicantsCount = await ApplicationModel.countDocuments({ collaboration: collab._id });
        return {
          ...collab.toObject(),
          commentsCount,
          applicantsCount,
        };
      })
    );

    res.status(200).json({ success: true, count: updatedCollaborations.length, data: updatedCollaborations });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get current user's collaborations
// @route   GET /api/collaborations/my
// @access  Private (Registered members)
export const getMyCollaborations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const collaborations = await Collaboration.find({ byUser: userId }).sort({ createdAt: -1 });
    const updatedCollaborations = await Promise.all(
      collaborations.map(async (collab) => {
        const commentsCount = await Comment.countDocuments({ collaborationId: collab._id });
        const applicantsCount = await ApplicationModel.countDocuments({ collaboration: collab._id });
        return {
          ...collab.toObject(),
          commentsCount,
          applicantsCount,
        };
      })
    );

    res.status(200).json({ success: true, count: updatedCollaborations.length, data: updatedCollaborations });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Sliding window cache for collaboration view deduplication (IP/User + Collab ID -> timestamp)
const collabViewsCache = new Map<string, number>();
const COLLAB_VIEW_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown per IP per collaboration

// @desc    Get single collaboration details
// @route   GET /api/collaborations/:id
// @access  Public
export const getCollaborationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('byUser', 'fullName profilePicture');

    if (!collaboration) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    // Deduplicated view increment
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const cacheKey = `${clientIp}:${req.params.id}`;
    const now = Date.now();
    const lastViewed = collabViewsCache.get(cacheKey);

    if (!lastViewed || now - lastViewed > COLLAB_VIEW_COOLDOWN_MS) {
      collabViewsCache.set(cacheKey, now);
      collaboration.views += 1;
      await collaboration.save();
    }

    // Fetch active applications count for metrics
    const applicantsCount = await ApplicationModel.countDocuments({
      collaboration: collaboration._id,
    });

    const comments = await Comment.find({ collaborationId: collaboration._id })
      .populate('userId', 'fullName profilePicture')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...collaboration.toObject(),
        applicantsCount,
        comments,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new collaboration request
// @route   POST /api/collaborations
// @access  Private (Registered members)
export const createCollaboration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, project, requiredSkills, techStack, commitment, duration, timezone, rolesNeeded } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const activeCount = await Collaboration.countDocuments({ byUser: userId, status: 'open' });
    if (activeCount >= 3) {
      res.status(400).json({ message: 'Maximum of 3 active collaboration posts reached.' });
      return;
    }

    const collab = await Collaboration.create({
      title,
      description,
      project: project || null,
      byUser: userId,
      requiredSkills,
      techStack,
      commitment,
      duration,
      timezone,
      rolesNeeded,
    });

    res.status(201).json({ success: true, data: collab });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Validation Error' });
  }
};

// @desc    Update a collaboration request
// @route   PATCH /api/collaborations/:id
// @access  Private (Registered owner)
export const updateCollaboration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    let collab = await Collaboration.findById(req.params.id);
    if (!collab) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    // Authorization verification
    if (collab.byUser.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this collaboration request' });
      return;
    }

    collab = await Collaboration.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: collab });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a collaboration request
// @route   DELETE /api/collaborations/:id
// @access  Private (Registered owner)
export const deleteCollaboration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const collab = await Collaboration.findById(req.params.id);
    if (!collab) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    // Authorization verification
    if (collab.byUser.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this collaboration request' });
      return;
    }

    // Cascade delete: purge all applications submitted to this request
    await ApplicationModel.deleteMany({ collaboration: collab._id });
    await Collaboration.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Collaboration request and applications deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Like / Unlike a collaboration request
// @route   POST /api/collaborations/:id/like
// @access  Private (Registered members)
export const toggleCollaborationLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const likeIndex = collab.likes.findIndex((id: any) => id.toString() === userId);
    if (likeIndex > -1) {
      // Unlike
      collab.likes.splice(likeIndex, 1);
    } else {
      // Like
      collab.likes.push(userObjectId);
    }

    await collab.save();
    res.status(200).json({
      success: true,
      likesCount: collab.likes.length,
      isLiked: collab.likes.some((id: any) => id.toString() === userId),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Apply to collaboration request
// @route   POST /api/collaborations/:id/apply
// @access  Private (Registered members)
export const createApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { role, githubUsername, portfolioLink, answers } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const collab = await Collaboration.findById(req.params.id);
    if (!collab) {
      res.status(404).json({ message: 'Collaboration request not found' });
      return;
    }

    if (collab.status !== 'open') {
      res.status(400).json({ message: 'This collaboration request is closed' });
      return;
    }

    // Rule: Creator cannot apply to their own request
    if (collab.byUser.toString() === userId) {
      res.status(400).json({ message: 'You cannot apply to your own collaboration request' });
      return;
    }

    // Rule: Role must match rolesNeeded
    if (!collab.rolesNeeded.includes(role)) {
      res.status(400).json({ message: `Role '${role}' is not requested for this collaboration` });
      return;
    }

    // Check duplicate application
    const existingApp = await ApplicationModel.findOne({
      collaboration: collab._id,
      applicant: userObjectId,
    });
    if (existingApp) {
      res.status(400).json({ message: 'You have already applied to this collaboration' });
      return;
    }

    const newApp = await ApplicationModel.create({
      collaboration: collab._id,
      applicant: userObjectId,
      role,
      githubUsername,
      portfolioLink,
      answers,
    });

    // Create notification for collaboration listing owner
    const applicantUser = await User.findById(userId);
    const applicantName = applicantUser ? applicantUser.fullName : 'A member';

    await Notification.create({
      userId: collab.byUser,
      sender: userObjectId,
      type: 'application_received',
      title: `New Applicant: ${collab.title}`,
      message: `${applicantName} has applied for the ${role} position.`,
      link: '/dashboard/applications',
    });

    res.status(201).json({ success: true, data: newApp });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
