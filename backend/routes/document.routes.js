import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import {
  uploadDocument,
  getDocument,
  getDocuments,
  deleteDocument,
} from '../controllers/document.controllers.js';
import upload from '../config/multer.js';

const router = express.Router();

// @access Private
router.use(protect);

// @desc Upload a new document
// @route POST /api/documents/upload
router.post('/upload', upload.single('file'), uploadDocument);

// @desc Get all the user's documents
// @route GET /api/documents/
router.get('/', getDocuments);

// @desc Get a user's document
// @route GET /api/documents/:id
router.get('/:id', getDocument);

// @desc Delete a document
// @route DELETE /api/documents/:id
router.delete('/:id', deleteDocument);

export default router;
