import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, getCurrentUser } from '../controllers/sessions.controller.js';

const router = Router();

// Register a new user
router.post('/register', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Get current user
router.get('/current', passport.authenticate('current', { session: false }), getCurrentUser);

export default router;
