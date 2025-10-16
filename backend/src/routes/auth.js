import express from 'express';
import { login, register, getProfile } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Publiczne endpointy
router.post('/login', login);
router.post('/register', register);

// Chronione endpointy
router.get('/profile', authenticateJWT, getProfile);

export default router;