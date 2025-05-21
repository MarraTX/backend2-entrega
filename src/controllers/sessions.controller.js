import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserRepository from '../repositories/UserRepository.js';

dotenv.config();

const generateToken = (userDto) => {
  return jwt.sign(userDto, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }
    
    const newCart = await Cart.create({ products: [] });
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id,
      role: role 
    });
    
    const userResponse = newUser.toObject();
    delete userResponse.password;

    const token = generateToken(userResponse);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    });
    
    res.status(201).json({ status: 'success', payload: userResponse });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;

    const token = generateToken(userResponse);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    });
    
    res.status(200).json({ status: 'success', payload: userResponse });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) { 
      return res.status(401).json({ status: 'error', message: 'User not authenticated or ID missing in token' });
    }

    const userId = req.user.id;
    const userDto = await UserRepository.getUserById(userId);

    if (!userDto) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({ status: 'success', payload: userDto });
  } catch (error) {
    console.error('Error in getCurrentUser:', error); 
    res.status(500).json({ status: 'error', message: 'Internal server error retrieving user data' });
  }
};
