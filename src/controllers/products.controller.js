import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    // Build filter object
    const filter = {};
    if (query) {
      filter.category = query;
    }
    
    // Build sort options
    const sortOptions = {};
    if (sort) {
      sortOptions.price = sort === 'asc' ? 1 : -1;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get products
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    // Build response
    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${parseInt(page) - 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    
    res.status(200).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    // Check if product with same code already exists
    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return res.status(400).json({ status: 'error', message: 'Product code already exists' });
    }
    
    // Create new product
    const newProduct = await Product.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || []
    });
    
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    
    // Check if code is being updated and if it's already in use
    if (code && code !== product.code) {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return res.status(400).json({ status: 'error', message: 'Product code already in use' });
      }
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, code, price, stock, category, thumbnails },
      { new: true }
    );
    
    res.status(200).json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    
    // Delete product
    await Product.findByIdAndDelete(id);
    
    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
