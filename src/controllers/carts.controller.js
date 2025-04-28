import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id).populate('products.product');
    
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    
    // Check if cart exists
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    // Check if product exists
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    
    // Check if product is in stock
    if (product.stock < quantity) {
      return res.status(400).json({ status: 'error', message: 'Not enough stock available' });
    }
    
    // Check if product is already in cart
    const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
    
    if (productIndex !== -1) {
      // Update quantity if product already exists in cart
      cart.products[productIndex].quantity += parseInt(quantity);
    } else {
      // Add product to cart if it doesn't exist
      cart.products.push({
        product: pid,
        quantity: parseInt(quantity)
      });
    }
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    // Check if cart exists
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    // Remove product from cart
    cart.products = cart.products.filter(item => item.product.toString() !== pid);
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    // Check if cart exists
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    // Validate products
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', message: 'Products must be an array' });
    }
    
    // Update cart products
    cart.products = products;
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be a positive number' });
    }
    
    // Check if cart exists
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    // Find product in cart
    const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
    
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
    }
    
    // Update quantity
    cart.products[productIndex].quantity = parseInt(quantity);
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    
    // Check if cart exists
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    // Clear cart
    cart.products = [];
    
    // Save cart
    await cart.save();
    
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
