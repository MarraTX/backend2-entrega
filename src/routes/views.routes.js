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

// Middleware para rutas que REQUIEREN autenticación
const isAuthenticated = (req, res, next) => {
  if (req.cookies.jwt) {
    return passport.authenticate('current', { session: false })(req, res, next);
  }
  return res.redirect('/login');
};

// Middleware para autenticación OPCIONAL (suave)
const softAuthenticate = (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error en softAuthenticate:', err);
      return next();
    }
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
};

// Home page
router.get('/', softAuthenticate, renderHome);

// Login page
router.get('/login', renderLogin);

// Register page
router.get('/register', renderRegister);

// Profile page (authenticated users only)
router.get('/profile', isAuthenticated, renderProfile);

// Products page
router.get('/products', softAuthenticate, renderProducts);

// Cart page (authenticated users only)
router.get('/cart', isAuthenticated, renderCart);

export default router;
