import { Router } from 'express';
import { getEvents, getEventById, registerForEvent } from '../controllers/eventController.js';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/:id/register', registerForEvent);

export default router;
