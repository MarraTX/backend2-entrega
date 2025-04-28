import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }
    
    // Create a new cart for the user
    const newCart = await Cart.create({ products: [] });
    
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Create the new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id
    });
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Set JWT as cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({ status: 'success', payload: userResponse });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Set JWT as cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(200).json({ status: 'success', payload: userResponse });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const logout = (req, res) => {
  // Clear JWT cookie
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

export const getCurrentUser = (req, res) => {
  // The user is already attached to req by passport middleware
  const userResponse = req.user.toObject();
  delete userResponse.password;
  
  res.status(200).json({ status: 'success', payload: userResponse });
};
