import { Router } from 'express';
import passport from 'passport';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import { authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', passport.authenticate('current', { session: false }), authorizeAdmin, createProduct);

router.put('/:id', passport.authenticate('current', { session: false }), authorizeAdmin, updateProduct);

router.delete('/:id', passport.authenticate('current', { session: false }), authorizeAdmin, deleteProduct);

export default router;
