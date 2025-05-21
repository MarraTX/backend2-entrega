import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import usersRouter from './routes/users.routes.js';

// Config
import initializePassport from './config/passport.config.js';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Initialize passport
initializePassport();
app.use(passport.initialize());

// Helper functions for Handlebars
const range = (start, end) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

const eq = (a, b) => {
  return a === b;
};

const multiply = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a * b;
  }
  return 0; // O manejar el error como prefieras
};

const calculateTotal = (products) => {
  let total = 0;
  if (Array.isArray(products)) {
    products.forEach(item => {
      if (item && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
        total += item.product.price * item.quantity;
      }
    });
  }
  return total.toFixed(2); // Devuelve con 2 decimales
};

const addNumbers = (a, b) => {
  const numA = parseFloat(a); // calculateTotal devuelve un string con toFixed(2)
  const numB = parseFloat(b);
  if (!isNaN(numA) && !isNaN(numB)) {
    return (numA + numB).toFixed(2);
  }
  return 'Error'; // O manejar el error como prefieras
};

// Configure handlebars
app.engine('handlebars', handlebars.engine({
    helpers: {
        range,
        eq,
        multiply,
        calculateTotal,
        addNumbers
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
