import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { Notification } from '../models/Notification.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

// @desc    Get all published events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch only published events
    const events = await Event.find({ isPublished: true })
      .populate('createdBy', 'fullName')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get current user's (or all if admin) events for management
// @route   GET /api/events/dashboard
// @access  Private (Registered members)
export const getDashboardEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    let filter = {};
    if (req.user?.role !== 'admin') {
      filter = { createdBy: userId };
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'fullName')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName');

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Registered members)
export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, eventType, date, time, timezone, mode, locationOrLink, maxParticipants, status } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const event = await Event.create({
      title,
      description,
      eventType,
      date,
      time,
      timezone,
      mode,
      locationOrLink,
      maxParticipants: maxParticipants || 0,
      status: status || 'upcoming',
      createdBy: userId,
      isPublished: true,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Validation Error' });
  }
};

// @desc    Update an event
// @route   PATCH /api/events/:id
// @access  Private (Registered owner / admin)
export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    let event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy.toString() !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this event' });
      return;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Registered owner / admin)
export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy.toString() !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this event' });
      return;
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Register a participant for an upcoming event
// @route   POST /api/events/:id/register
// @access  Public
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ message: 'Please provide both name and email' });
      return;
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.status !== 'upcoming') {
      res.status(400).json({ message: 'Registration is only allowed for upcoming events' });
      return;
    }

    const isRegistered = event.participants.some(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );
    if (isRegistered) {
      res.status(400).json({ message: 'You have already registered for this event' });
      return;
    }

    if (event.maxParticipants > 0 && event.participants.length >= event.maxParticipants) {
      res.status(400).json({ message: 'This event has reached its maximum registration capacity' });
      return;
    }

    event.participants.push({ name, email });
    await event.save();

    // Trigger notification for the event creator
    await Notification.create({
      userId: event.createdBy,
      type: 'event_update',
      title: `New Registration: ${event.title}`,
      message: `${name} (${email}) has registered for your upcoming event.`,
      link: '/dashboard/events',
    });

    res.status(200).json({
      success: true,
      message: 'Successfully registered for this event!',
      participantsCount: event.participants.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get event attendees/participants
// @route   GET /api/events/:id/attendees
// @access  Private (Owner / admin)
export const getEventAttendees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const userId = req.user?.id;
    if (event.createdBy.toString() !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to view attendees' });
      return;
    }

    res.status(200).json({ success: true, data: event.participants });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
