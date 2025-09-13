const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken
} = require('../controllers/authController');
const { protect, sensitiveOperationLimit } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules - Flexible for any email and password
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required'),
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  body('phone')
    .optional()
];

const loginValidation = [
  body('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, sensitiveOperationLimit(5, 15 * 60 * 1000), login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordValidation, validate, sensitiveOperationLimit(3, 60 * 60 * 1000), forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', forgotPasswordValidation, validate, sensitiveOperationLimit(3, 60 * 60 * 1000), resendVerification);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfileValidation, validate, updateProfile);
router.put('/update-password', protect, updatePasswordValidation, validate, sensitiveOperationLimit(3, 60 * 60 * 1000), updatePassword);

module.exports = router;
