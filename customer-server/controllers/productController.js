const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      rating,
      brand,
      featured,
      status = 'active'
    } = req.query;

    // Build filter object
    const filter = { status };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (rating) {
      filter['rating.average'] = { $gte: parseFloat(rating) };
    }

    if (brand) {
      filter.brand = new RegExp(brand, 'i');
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy -updatedBy');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      products
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
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews', 'rating comment user createdAt', null, { limit: 5, sort: { createdAt: -1 } })
      .populate('relatedProducts', 'name price images rating')
      .select('-createdBy -updatedBy');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add to recently viewed if user is authenticated
    if (req.user) {
      await req.user.addRecentlyViewed(product._id);
    }

    // Increment view count
    await product.incrementViews();

    // Emit real-time event for analytics
    if (req.app.get('io')) {
      req.app.get('io').emitToAdmin('product:viewed', {
        productId: product._id,
        productName: product.name,
        userId: req.user?._id,
        timestamp: new Date()
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

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res, next) => {
  try {
    const {
      q,
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      rating,
      brand
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search filter
    const filter = {
      status: 'active',
      $text: { $search: q }
    };

    // Add additional filters
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const products = await Product.find(filter, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' }, ...parseSortString(sort) })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdBy -updatedBy');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      query: q,
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
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  addProductView,
  getProductReviews
};
