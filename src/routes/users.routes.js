import { Router } from 'express';
import passport from 'passport';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = Router();

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
};

router.get('/', passport.authenticate('current', { session: false }), isAdmin, getAllUsers);

router.get('/:id', passport.authenticate('current', { session: false }), getUserById);

router.post('/', passport.authenticate('current', { session: false }), isAdmin, createUser);

router.put('/:id', passport.authenticate('current', { session: false }), updateUser);

router.delete('/:id', passport.authenticate('current', { session: false }), isAdmin, deleteUser);

export default router;
