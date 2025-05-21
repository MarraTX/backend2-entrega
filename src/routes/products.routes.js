import { Router } from 'express';
import passport from 'passport';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import { authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Get all products
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create a new product (admin only)
router.post('/', passport.authenticate('current', { session: false }), authorizeAdmin, createProduct);

// Update a product (admin only)
router.put('/:id', passport.authenticate('current', { session: false }), authorizeAdmin, updateProduct);

// Delete a product (admin only)
router.delete('/:id', passport.authenticate('current', { session: false }), authorizeAdmin, deleteProduct);

export default router;
