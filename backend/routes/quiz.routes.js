import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import {
  deleteQuiz,
  getQuizById,
  getQuizResults,
  getQuizzes,
  submitQuiz,
} from '../controllers/quiz.controllers.js';

const router = express.Router();

// @access Private
router.use(protect);

// @desc Get all quizzes for a document
// @route GET /api/quizzes/:documentId
router.get('/:documentId', getQuizzes);

// @desc Get a single quiz by ID
// @route GET /api/quizzes/quiz/:id
router.get('/quiz/:id', getQuizById);

// @desc Submit quiz answers
// @route POST /api/quizzes/:id/submit
router.post('/:id/submit', submitQuiz);

// @desc Get quiz results
// @route GET /api/quizzes/:id/results
router.get('/:id/results', getQuizResults);

// @desc Delete a quiz
// @route DELETE /api/quizzes/:id
router.delete('/:id', deleteQuiz);

export default router;
