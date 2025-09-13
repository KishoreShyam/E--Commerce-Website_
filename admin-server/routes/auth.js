const express = require('express');
const { body } = require('express-validator');
const {
  adminLogin,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  createAdmin,
  getAdminUsers,
  updateAdminStatus
} = require('../controllers/authController');
const { protect, requireSuperAdmin, sensitiveOperationLimit, validateSuperAdminKey } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const createAdminValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
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
    .withMessage('Last name must be between 2 and 50 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Public routes
router.post('/login', loginValidation, validate, sensitiveOperationLimit(5, 15 * 60 * 1000), adminLogin);
router.post('/logout', adminLogout);

// Protected routes
router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, updateProfileValidation, validate, updateAdminProfile);
router.put('/change-password', protect, changePasswordValidation, validate, sensitiveOperationLimit(3, 60 * 60 * 1000), changePassword);

// Super admin routes
router.post('/create-admin', protect, requireSuperAdmin, validateSuperAdminKey, createAdminValidation, validate, createAdmin);
router.get('/admins', protect, requireSuperAdmin, getAdminUsers);
router.put('/admin/:id/status', protect, requireSuperAdmin, validateSuperAdminKey, updateAdminStatus);

module.exports = router;
