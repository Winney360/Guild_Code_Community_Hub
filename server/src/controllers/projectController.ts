import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
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

// @desc    Get single project and increment views
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, isVisible: true })
      .populate('byUser', 'fullName profilePicture');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Spec 7.2: Increment views count on view
    project.views += 1;
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Like / Unlike a project
// @route   POST /api/projects/:id/like
// @access  Private (Registered members)
export const toggleProjectLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Toggle user ID in likes array (using string comparison for reliability)
    const likeIndex = project.likes.findIndex((id: any) => id.toString() === userId);
    if (likeIndex > -1) {
      // Unlike
      project.likes.splice(likeIndex, 1);
    } else {
      // Like
      project.likes.push(userObjectId);
    }

    await project.save();
    res.status(200).json({
      success: true,
      likesCount: project.likes.length,
      isLiked: project.likes.some((id: any) => id.toString() === userId),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
