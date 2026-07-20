import { Request, Response } from 'express';
import { Application as ApplicationModel } from '../models/Application.js';
import { Collaboration } from '../models/Collaboration.js';
import { Notification } from '../models/Notification.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// @desc    Get dashboard applications (received on my requests and submitted by me)
// @route   GET /api/applications/dashboard
// @access  Private (Registered members)
export const getDashboardApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // Find all collaborations posted by this user
    const myCollabs = await Collaboration.find({ byUser: userId }).select('_id');
    const myCollabIds = myCollabs.map((c) => c._id);

    // Applications received on my listings
    const received = await ApplicationModel.find({ collaboration: { $in: myCollabIds } })
      .populate('collaboration', 'title')
      .populate('applicant', 'fullName email')
      .sort({ appliedAt: -1 });

    // Applications submitted by me
    const submitted = await ApplicationModel.find({ applicant: userId })
      .populate({
        path: 'collaboration',
        select: 'title byUser',
        populate: {
          path: 'byUser',
          select: 'fullName',
        },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      received,
      submitted,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update application status (accept/decline)
// @route   PATCH /api/applications/:id/status
// @access  Private (Collaboration owner only)
export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    if (!['reviewed', 'accepted', 'declined'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const application = await ApplicationModel.findById(req.params.id)
      .populate('collaboration');

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    // Verify authorized user is the owner of the collaboration listing
    const collab = application.collaboration as any;
    if (collab.byUser.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to review this application' });
      return;
    }

    application.status = status;
    await application.save();

    // Trigger notification for the applicant
    await Notification.create({
      userId: application.applicant,
      sender: collab.byUser,
      type: status === 'accepted' ? 'application_accepted' : 'application_rejected',
      title: `Application Update: ${collab.title}`,
      message: `Your application for the ${application.role} position has been ${status}.`,
      link: '/dashboard/applications',
    });

    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
