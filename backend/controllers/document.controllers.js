import Document from '../models/document.models.js';
import Flashcard from '../models/flashcard.models.js';
import Quiz from '../models/quiz.models.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import { extractTextFromPdf } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import { deleteFile, upload } from './upload.controllers.js';

const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPdf(filePath);

    const chunks = chunkText(text, 500, 50);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: 'ready',
    });

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);

    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
    });
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400,
      });
    }

    const { title } = req.body;

    if (!title) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400,
      });
    }

    const file = await upload(req.file.path);

    // Create document record
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: file.url,
      fileId: file.fileId,
      fileSize: req.file.size,
      status: 'processing',
    });

    processPDF(document._id, req.file.path).catch((err) => {
      console.error('PDF processing error:', err);
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Document uploaded successfully. Processing in progress',
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes',
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizzes' },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    let document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Document Not Found',
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });
    const quizCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user._id });

    document.lastAccessed = Date.now();
    await document.save();

    document = document.toObject();
    document.flashcardCount = flashcardCount;
    document.quizCount = quizCount;

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Document Not Found',
      });
    }

    // Delete file from cloud
    if (document.fileId) {
      await deleteFile(document.fileId);
    }

    // Delete file from database
    await document.deleteOne();
    await Flashcard.deleteMany({ documentId: document._id });
    await Quiz.deleteMany({ documentId: document._id });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { uploadDocument, getDocument, getDocuments, deleteDocument };
