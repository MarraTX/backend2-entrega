import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').populate('cart');
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    res.status(200).json({ status: 'success', payload: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createUser = async (req, res) => {
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
      role: role || 'user'
    });
    
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({ status: 'success', payload: userResponse });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, age, role } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'Email already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { first_name, last_name, email, age, role },
      { new: true }
    ).select('-password');
    
    res.status(200).json({ status: 'success', payload: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    await User.findByIdAndDelete(id);
    
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
