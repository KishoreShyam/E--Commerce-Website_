const axios = require('axios');

// @desc    Get all products
// @route   GET /api/products
// @access  Private (Admin)
const getProducts = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/products`, {
      headers: {
        Authorization: req.headers.authorization
      },
      params: req.query
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get products error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products from customer server'
      });
    }
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private (Admin)
const getProduct = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/products/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get product error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product from customer server'
      });
    }
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res, next) => {
  try {
    console.log('🆕 Admin creating product:', req.body.name);
    
    const response = await axios.post(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/products`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Product created successfully:', response.data.product?.name);

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Create product error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create product on customer server'
      });
    }
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res, next) => {
  try {
    console.log('📝 Admin updating product:', req.params.id);
    
    const response = await axios.put(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/products/${req.params.id}`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Product updated successfully');

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Update product error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update product on customer server'
      });
    }
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    console.log('🗑️ Admin deleting product:', req.params.id);
    
    const response = await axios.delete(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/products/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    console.log('✅ Product deleted successfully');

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Delete product error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete product on customer server'
      });
    }
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private (Admin)
const getProductStats = async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.CUSTOMER_SERVER_URL || 'http://localhost:5000'}/api/products`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    const products = response.data.products || [];
    
    const stats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      inactive: products.filter(p => p.status === 'inactive').length,
      featured: products.filter(p => p.featured).length,
      lowStock: products.filter(p => p.inventory?.stock <= (p.inventory?.lowStockThreshold || 10)).length,
      outOfStock: products.filter(p => p.inventory?.stock === 0).length
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get product stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
};