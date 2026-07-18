import { Request, Response } from 'express';
import { Project } from '../models/Project.js';

// @desc    Get all visible projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all projects where isVisible is true, populated with user info
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
