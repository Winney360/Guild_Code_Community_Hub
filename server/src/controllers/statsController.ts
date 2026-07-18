import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Event } from '../models/Event.js';

// @desc    Get public landing page statistics
// @route   GET /api/stats
// @access  Public
export const getPlatformStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Spec 4.1: Active Members (role = 'member' and isActive = true)
    const activeMembersCount = await User.countDocuments({
      isActive: true,
      role: 'member',
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
