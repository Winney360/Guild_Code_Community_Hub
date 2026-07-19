import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

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

// @desc    Register a participant for an upcoming event
// @route   POST /api/events/:id/register
// @access  Public (No auth required per Spec 7.6)
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

    // Spec check: registration only allowed for upcoming events
    if (event.status !== 'upcoming') {
      res.status(400).json({ message: 'Registration is only allowed for upcoming events' });
      return;
    }

    // Check if participant is already registered
    const isRegistered = event.participants.some(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );
    if (isRegistered) {
      res.status(400).json({ message: 'You have already registered for this event' });
      return;
    }

    // Check maximum capacity limit
    if (event.maxParticipants > 0 && event.participants.length >= event.maxParticipants) {
      res.status(400).json({ message: 'This event has reached its maximum registration capacity' });
      return;
    }

    // Add participant details
    event.participants.push({ name, email });
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for this event!',
      participantsCount: event.participants.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
