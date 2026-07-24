import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Event } from '../models/Event.js';
import { Collaboration } from '../models/Collaboration.js';
import { Application as ApplicationModel } from '../models/Application.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// @desc    Get public landing page statistics
// @route   GET /api/stats
// @access  Public
export const getPlatformStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Spec 4.1: Active Members (isActive = true and status = 'active')
    const activeMembersCount = await User.countDocuments({
      $or: [{ isActive: true }, { status: 'active' }],
    });

    // Spec 4.1: Projects Shared (isVisible = true)
    const projectsSharedCount = await Project.countDocuments({
      isVisible: true,
    });

    // Spec 4.1: Upcoming Events (status = 'upcoming' and isPublished = true)
    const upcomingEventsCount = await Event.countDocuments({
      status: 'upcoming',
      isPublished: true,
    });

    res.status(200).json({
      success: true,
      stats: {
        activeMembers: activeMembersCount,
        projectsShared: projectsSharedCount,
        upcomingEvents: upcomingEventsCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get logged-in user dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // 1. Active Projects Count
    const activeProjects = await Project.countDocuments({ byUser: userId, isVisible: true });

    // 2. Open Collaborations Count
    const openCollaborations = await Collaboration.countDocuments({ byUser: userId, status: 'open' });

    // 3. New (Pending) Applications received on collaborations
    const myCollabs = await Collaboration.find({ byUser: userId }).select('_id');
    const myCollabIds = myCollabs.map(c => c._id);
    const newApplications = await ApplicationModel.countDocuments({
      collaboration: { $in: myCollabIds },
      status: 'pending'
    });

    // 4. Total Views across all user's projects (analogous to profile engagement views)
    const myProjects = await Project.find({ byUser: userId }).select('views');
    const totalProjectViews = myProjects.reduce((acc, p) => acc + (p.views || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        activeProjects,
        openCollaborations,
        newApplications,
        profileViews: totalProjectViews
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
