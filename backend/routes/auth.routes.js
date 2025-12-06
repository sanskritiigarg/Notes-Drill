import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import { registerValidation, loginValidation } from '../middlewares/validators.middlewares.js';
import {
  getProfile,
  login,
  register,
  updateProfile,
  changePassword,
} from '../controllers/auth.controllers.js';

const router = express.Router();

// @access Public
// @desc Register new user
// @route POST /api/users/register
router.post('/register', registerValidation, register);

// @access Public
// @desc Login user
// @route POST /api/users/login
router.post('/login', loginValidation, login);

// @access Private
// @desc Get user profile
// @route GET /api/users/profile
router.get('/profile', protect, getProfile);

// @access Private
// @desc Update user profile
// @route PUT /api/users/profile
router.put('/profile', protect, updateProfile);

// @access Private
// @desc Change user password
// @route PUT /api/users/change-password
router.put('/change-password', protect, changePassword);

export default router;
