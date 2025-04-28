import { Router } from 'express';
import passport from 'passport';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';

const router = Router();

// Middleware to check if user is authenticated and is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
};

// Get all products
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create a new product (admin only)
router.post('/', passport.authenticate('current', { session: false }), isAdmin, createProduct);

// Update a product (admin only)
router.put('/:id', passport.authenticate('current', { session: false }), isAdmin, updateProduct);

// Delete a product (admin only)
router.delete('/:id', passport.authenticate('current', { session: false }), isAdmin, deleteProduct);

export default router;
