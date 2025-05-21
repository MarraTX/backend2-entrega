import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Ticket from '../models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid'; // Para generar códigos únicos de ticket
import { sendEmail } from '../services/email.service.js'; // Importar el servicio de correo usando ES Modules

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

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  if (!req.user || !req.user.email) {
    return res.status(401).json({ status: 'error', message: 'Usuario no autenticado o email no disponible.' });
  }
  const userEmail = req.user.email;

  try {
    const cart = await Cart.findById(cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({ status: 'error', message: 'El carrito está vacío, no se puede procesar la compra.' });
    }

    let totalAmount = 0;
    const productsSuccessfullyPurchasedDetails = [];
    const productsNotPurchasedIds = [];
    const remainingProductsInCart = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantityInCart = item.quantity;

      if (product.stock >= quantityInCart) {
        product.stock -= quantityInCart;
        await product.save();
        totalAmount += product.price * quantityInCart;
        productsSuccessfullyPurchasedDetails.push({
          id: product._id.toString(),
          title: product.title,
          quantity: quantityInCart,
          price: product.price,
          subtotal: product.price * quantityInCart
        });
      } else {
        productsNotPurchasedIds.push(product._id.toString());
        remainingProductsInCart.push(item); 
      }
    }

    if (productsSuccessfullyPurchasedDetails.length === 0) {
      cart.products = remainingProductsInCart; 
      await cart.save(); 
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo procesar la compra. No hay stock suficiente para ningún producto del carrito.',
        productsNotPurchasedIds,
      });
    }

    const ticketCode = uuidv4();
    const newTicket = new Ticket({
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
    });
    await newTicket.save();

    cart.products = remainingProductsInCart;
    await cart.save();

    const emailSubject = 'Confirmación de tu Compra';
    let emailHtml = `<h1>¡Gracias por tu compra, ${userEmail}!</h1>
                     <p>Tu pedido con código <strong>${ticketCode}</strong> ha sido procesado.</p>
                     <h2>Detalles de la Compra:</h2>
                     <p>Monto Total: $${totalAmount.toFixed(2)}</p>
                     <h3>Productos Comprados:</h3><ul>`;
    productsSuccessfullyPurchasedDetails.forEach(p => {
      emailHtml += `<li>${p.title} (x${p.quantity}) - $${p.subtotal.toFixed(2)}</li>`;
    });
    emailHtml += `</ul>`;

    if (productsNotPurchasedIds.length > 0) {
      emailHtml += `<p style="color:red;"><strong>Algunos productos no pudieron ser procesados por falta de stock y permanecen en tu carrito:</strong></p><ul>`;
      const unpurchasedProductDetails = await Product.find({ _id: { $in: productsNotPurchasedIds } }).select('title').lean();
      unpurchasedProductDetails.forEach(p => {
        emailHtml += `<li>${p.title}</li>`;
      });
      emailHtml += `</ul>`;
    }
    emailHtml += `<p>¡Esperamos verte pronto!</p>`;

    try {
      await sendEmail({ to: userEmail, subject: emailSubject, html: emailHtml });
      console.log(`Confirmation email sent to ${userEmail} for ticket ${ticketCode}`);
    } catch (emailError) {
      console.error(`Error sending confirmation email to ${userEmail} for ticket ${ticketCode}:`, emailError);
    }

    res.status(200).json({
      status: 'success',
      message: 'Compra procesada exitosamente.',
      ticket: newTicket,
      productsNotPurchasedIds,
    });

  } catch (error) {
    console.error('Error during cart purchase:', error);
    res.status(500).json({ status: 'error', message: `Internal server error during purchase: ${error.message}` });
  }
};
