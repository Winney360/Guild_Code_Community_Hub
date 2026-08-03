import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// @desc    Get all visible projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ isVisible: true })
      .populate('byUser', 'fullName profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get current user's projects
// @route   GET /api/projects/my
// @access  Private (Registered members)
export const getMyProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const projects = await Project.find({ byUser: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, isVisible: true })
      .populate('byUser', 'fullName profilePicture role bio github');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Sliding window cache for view deduplication (IP/User + Project ID -> timestamp)
const projectViewsCache = new Map<string, number>();
const VIEW_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown per IP per project

// @desc    Increment project views count on explicit view action (restricted)
// @route   POST /api/projects/:id/view
// @access  Public
export const incrementProjectView = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const cacheKey = `${clientIp}:${req.params.id}`;
    const now = Date.now();
    const lastViewed = projectViewsCache.get(cacheKey);

    // Only increment if not viewed within cooldown period
    if (!lastViewed || now - lastViewed > VIEW_COOLDOWN_MS) {
      projectViewsCache.set(cacheKey, now);
      project.views += 1;
      await project.save();
    }

    res.status(200).json({ success: true, views: project.views });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Registered members)
export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, shortDescription, category, techStack, coverImage, links } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const project = await Project.create({
      title,
      description,
      shortDescription,
      category,
      techStack,
      coverImage,
      links,
      byUser: userId,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Validation Error' });
  }
};

// @desc    Update a project
// @route   PATCH /api/projects/:id
// @access  Private (Registered owner)
export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    let project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Authorization verification
    if (project.byUser.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this project' });
      return;
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Registered owner)
export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Authorization verification
    if (project.byUser.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this project' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Like / Unlike a project
// @route   POST /api/projects/:id/like
// @access  Public (registered members or anonymous visitors with a device identifier)
export const toggleProjectLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const userId = req.user?.id;
    const deviceId = (req.headers['x-device-id'] as string | undefined)?.trim();

    // Registered users are identified by their id; anonymous visitors by a device-scoped id
    const likerId = userId || (deviceId ? `device:${deviceId}` : undefined);
    if (!likerId) {
      res.status(400).json({ message: 'A user or device identifier is required' });
      return;
    }

    // Toggle liker id in likes array (using string comparison for reliability)
    const likeIndex = project.likes.findIndex((id: any) => id.toString() === likerId);
    let isLikedNow = false;
    if (likeIndex > -1) {
      // Unlike
      project.likes.splice(likeIndex, 1);
    } else {
      // Like
      project.likes.push(likerId as any);
      isLikedNow = true;

      // Notify project owner only when a registered member likes (anonymous likes skip notifications)
      if (userId && project.byUser.toString() !== userId) {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const likerUser = await User.findById(userId);
        const likerName = likerUser ? likerUser.fullName : 'A member';
        await Notification.create({
          userId: project.byUser,
          sender: userObjectId,
          type: 'project_liked',
          title: 'New Like on Project',
          message: `${likerName} liked your project "${project.title}".`,
          link: `/projects/${project._id}`,
        });
      }
    }

    await project.save();
    res.status(200).json({
      success: true,
      likesCount: project.likes.length,
      isLiked: isLikedNow,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
