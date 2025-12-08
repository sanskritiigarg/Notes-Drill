import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import {
  chat,
  explainConcept,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  getChatHistory,
} from '../controllers/ai.controllers.js';

const router = express.Router();

// @accesss Private
router.use(protect);

// @desc Generate flashcards from document
// @route POST /api/ai/generate-flashcards
router.post('/generate-flashcards', generateFlashcards);

// @desc Generate quiz from document
// @route POST /api/ai/generate-quiz
router.post('/generate-quiz', generateQuiz);

// @desc Generate summary from document
// @route POST /api/ai/generate-summary
router.post('/generate-summary', generateSummary);

// @desc Chat with document
// @route POST /api/ai/chat
router.post('/chat', chat);

// @desc Explain concept from document
// @route POST /api/ai/explain-concept
router.post('/explain-concept', explainConcept);

// @desc Get chat history for a document
// @route GET /api/ai/chat-history/:documentId
router.get('/chat-history/:documentId', getChatHistory);

export default router;
