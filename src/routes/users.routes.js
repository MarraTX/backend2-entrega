import { Router } from 'express';
import passport from 'passport';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = Router();

// Middleware to check if user is authenticated and is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
};

// Get all users (admin only)
router.get('/', passport.authenticate('current', { session: false }), isAdmin, getAllUsers);

// Get user by ID
router.get('/:id', passport.authenticate('current', { session: false }), getUserById);

// Create a new user (admin only)
router.post('/', passport.authenticate('current', { session: false }), isAdmin, createUser);

// Update a user
router.put('/:id', passport.authenticate('current', { session: false }), updateUser);

// Delete a user (admin only)
router.delete('/:id', passport.authenticate('current', { session: false }), isAdmin, deleteUser);

export default router;
