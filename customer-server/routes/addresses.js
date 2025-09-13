const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getAddress,
  setDefaultAddress,
  getDefaultAddress
} = require('../controllers/addressController');

// Validation middleware
const addressValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('type').optional().isIn(['home', 'work', 'other']).withMessage('Invalid address type')
];

// @route   GET /api/addresses
// @desc    Get all user addresses
// @access  Private
router.get('/', auth, getUserAddresses);

// @route   GET /api/addresses/default
// @desc    Get default address
// @access  Private
router.get('/default', auth, getDefaultAddress);

// @route   GET /api/addresses/:id
// @desc    Get specific address
// @access  Private
router.get('/:id', auth, getAddress);

// @route   POST /api/addresses
// @desc    Create new address
// @access  Private
router.post('/', auth, addressValidation, createAddress);

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put('/:id', auth, addressValidation, updateAddress);

// @route   PUT /api/addresses/:id/default
// @desc    Set address as default
// @access  Private
router.put('/:id/default', auth, setDefaultAddress);

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', auth, deleteAddress);

module.exports = router;
