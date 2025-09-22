const Product = require('../models/Product');
const Category = require('../models/Category');
const fileDB = require('../utils/fileDB');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    // Get products from file database
    const products = fileDB.getProducts();
    
    // Apply filters
    let filteredProducts = products.filter(product => product.status === 'active');
    
    const { category, search, minPrice, maxPrice, featured } = req.query;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total,
      pagination: {
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      products: paginatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = fileDB.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };
    
    const product = fileDB.createProduct(productData);
    
    // Emit real-time update to customer server
    if (req.app.get('io')) {
      req.app.get('io').emit('product:created', {
        product,
        timestamp: new Date()
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = fileDB.updateProduct(req.params.id, {
      ...req.body,
      updatedBy: req.user.id,
      updatedAt: new Date().toISOString()
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Emit real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('product:updated', {
        product,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const success = fileDB.deleteProduct(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Emit real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('product:deleted', {
        productId: req.params.id,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = fileDB.searchProducts(q);

    res.status(200).json({
      success: true,
      count: products.length,
      total: products.length,
      query: q,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      rating,
      brand
    } = req.query;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build filter
    const filter = {
      category: categoryId,
      status: 'active'
    };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };
    if (brand) filter.brand = new RegExp(brand, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy -updatedBy');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug
      },
      count: products.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      status: 'active',
      featured: true
    })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .select('-createdBy -updatedBy');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find related products by category and tags
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      status: 'active',
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } },
        { brand: product.brand }
      ]
    })
      .populate('category', 'name slug')
      .sort('-rating.average')
      .limit(8)
      .select('-createdBy -updatedBy');

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product view
// @route   POST /api/products/:id/view
// @access  Private
const addProductView = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add to user's recently viewed
    await req.user.addRecentlyViewed(product._id);

    res.status(200).json({
      success: true,
      message: 'Product view recorded'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const Review = require('../models/Review');
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: req.params.id });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to parse sort string
const parseSortString = (sortStr) => {
  const sortObj = {};
  const fields = sortStr.split(',');
  
  fields.forEach(field => {
    if (field.startsWith('-')) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });
  
  return sortObj;
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  addProductView,
  getProductReviews
};
