import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserRepository from '../repositories/UserRepository.js';

dotenv.config();

// Generate JWT token
const generateToken = (userDto) => {
  // userDto es el userResponse (un objeto plano con todos los campos necesarios del usuario, sin contraseña)
  // Firmamos este DTO directamente como el payload.
  return jwt.sign(userDto, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    
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
      cart: newCart._id,
      role: role // Si 'role' no está en req.body, será undefined y Mongoose usará el default del esquema
    });
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Generate JWT token
    const token = generateToken(userResponse);
    
    // Set JWT as cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
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
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Generate JWT token
    const token = generateToken(userResponse);
    
    // Set JWT as cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
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

export const getCurrentUser = async (req, res) => {
  try {
    // req.user is populated by passport.authenticate('current', ...)
    // It should contain the authenticated user's information, at least the ID.
    // The JWT payload created by generateToken has `id: user._id`.
    if (!req.user || !req.user.id) { 
      return res.status(401).json({ status: 'error', message: 'User not authenticated or ID missing in token' });
    }

    const userId = req.user.id; // This 'id' comes from the JWT payload
    const userDto = await UserRepository.getUserById(userId);

    if (!userDto) {
      // This could happen if the user was deleted after the token was issued
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({ status: 'success', payload: userDto });
  } catch (error) {
    console.error('Error in getCurrentUser:', error); 
    res.status(500).json({ status: 'error', message: 'Internal server error retrieving user data' });
  }
};
