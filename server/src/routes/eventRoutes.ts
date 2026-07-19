import { Router } from 'express';
import {
  getEvents,
  getDashboardEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventAttendees,
} from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getEvents);
router.get('/dashboard', protect, getDashboardEvents);
router.post('/', protect, createEvent);
router.get('/:id', getEventById);
router.patch('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', registerForEvent);
router.get('/:id/attendees', protect, getEventAttendees);

export default router;
