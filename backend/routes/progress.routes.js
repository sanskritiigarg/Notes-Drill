import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import { getDashboard } from '../controllers/progress.controllers.js';
const router = express.Router();

// @access Private
router.use(protect);

// @desc Get user learning statistics
// @route GET /api/progress/dashboard
router.get('/dashboard', getDashboard);

export default router;
