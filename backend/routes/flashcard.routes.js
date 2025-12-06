import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import {
  deleteFlashcardSet,
  getAllFlashcards,
  getFlashcards,
  reviewFlashcards,
  toggleStarFlashcards,
} from '../controllers/flashcard.controllers.js';

const router = express.Router();

// @access Private
router.use(protect);

// @desc Get all Flashcards for a user
// @route GET /api/flashcards
router.get('/', getAllFlashcards);

// @desc Get all flashcards of a document
// @route GET /api/flashcards/:documentId
router.get('/:documentId', getFlashcards);

// @desc Mark flashcard as reviewed
// @route POST /api/flashcards/:cardId/review
router.post('/:cardId/review', reviewFlashcards);

// @desc Toggle star a flashcard
// @route PUT /api/flashcards/:cardId/star
router.put('/:cardId/star', toggleStarFlashcards);

// @desc Delete a flashcard
// @route DELETE /api/flashcards/:id
router.delete('/:id', deleteFlashcardSet);

export default router;
