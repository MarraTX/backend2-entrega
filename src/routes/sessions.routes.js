import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, getCurrentUser } from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/current', passport.authenticate('current', { session: false }), getCurrentUser);

export default router;
