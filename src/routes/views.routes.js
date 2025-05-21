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

const isAuthenticated = (req, res, next) => {
  if (req.cookies.jwt) {
    return passport.authenticate('current', { session: false })(req, res, next);
  }
  return res.redirect('/login');
};

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

router.get('/', softAuthenticate, renderHome);

router.get('/login', renderLogin);

router.get('/register', renderRegister);

router.get('/profile', isAuthenticated, renderProfile);

router.get('/products', softAuthenticate, renderProducts);

router.get('/cart', isAuthenticated, renderCart);

export default router;
