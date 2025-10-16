import express from 'express';
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventsController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Wszystkie endpointy wymagają uwierzytelnienia
router.use(authenticateJWT);

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;