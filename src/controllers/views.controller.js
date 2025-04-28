import Product from '../models/product.model.js';

export const renderHome = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

export const renderLogin = (req, res) => {
  res.render('login');
};

export const renderRegister = (req, res) => {
  res.render('register');
};

export const renderProfile = (req, res) => {
  res.render('profile', { user: req.user });
};

export const renderProducts = async (req, res) => {
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
    
    res.render('products', {
      products,
      totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?limit=${limit}&page=${parseInt(page) - 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: page < totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      user: req.user
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

export const renderCart = async (req, res) => {
  try {
    if (!req.user || !req.user.cart) {
      return res.redirect('/login');
    }
    
    const cart = await req.user.cart.populate('products.product');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};
