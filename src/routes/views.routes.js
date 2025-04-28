import { Router } from 'express';
import passport from 'passport';
import { 
  renderHome, 
  renderLogin, 
  renderRegister, 
  renderProfile, 
  renderProducts, 
  renderCart 
} from '../controllers/views.controller.js';

const router = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.cookies.jwt) {
    return passport.authenticate('current', { session: false })(req, res, next);
  }
  return res.redirect('/login');
};

// Home page
router.get('/', renderHome);

// Login page
router.get('/login', renderLogin);

// Register page
router.get('/register', renderRegister);

// Profile page (authenticated users only)
router.get('/profile', isAuthenticated, renderProfile);

// Products page
router.get('/products', renderProducts);

// Cart page (authenticated users only)
router.get('/cart', isAuthenticated, renderCart);

export default router;
