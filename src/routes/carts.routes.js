import { Router } from 'express';
import passport from 'passport';
import { 
  getCartById, 
  createCart, 
  addProductToCart, 
  removeProductFromCart, 
  updateCart, 
  updateProductQuantity, 
  clearCart 
} from '../controllers/carts.controller.js';

const router = Router();

// Create a new cart
router.post('/', createCart);

// Get cart by ID
router.get('/:id', getCartById);

// Add product to cart
router.post('/:cid/product/:pid', passport.authenticate('current', { session: false }), addProductToCart);

// Remove product from cart
router.delete('/:cid/product/:pid', passport.authenticate('current', { session: false }), removeProductFromCart);

// Update cart with new products array
router.put('/:cid', passport.authenticate('current', { session: false }), updateCart);

// Update product quantity in cart
router.put('/:cid/product/:pid', passport.authenticate('current', { session: false }), updateProductQuantity);

// Clear cart
router.delete('/:cid', passport.authenticate('current', { session: false }), clearCart);

export default router;
