import { Router } from 'express';
import passport from 'passport';
import { 
  getCartById, 
  createCart, 
  addProductToCart, 
  removeProductFromCart, 
  updateCart, 
  updateProductQuantity, 
  clearCart,
  purchaseCart
} from '../controllers/carts.controller.js';
import { authorizeUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', createCart);

router.get('/:id', getCartById);

router.post('/:cid/product/:pid', passport.authenticate('current', { session: false }), authorizeRoles('user', 'admin'), addProductToCart);

router.delete('/:cid/product/:pid', passport.authenticate('current', { session: false }), removeProductFromCart);

router.put('/:cid', passport.authenticate('current', { session: false }), updateCart);

router.put('/:cid/product/:pid', passport.authenticate('current', { session: false }), updateProductQuantity);

router.delete('/:cid', passport.authenticate('current', { session: false }), clearCart);

router.post('/:cid/purchase', passport.authenticate('current', { session: false }), authorizeUser, purchaseCart);

export default router;
