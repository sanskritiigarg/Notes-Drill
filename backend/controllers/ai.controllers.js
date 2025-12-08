import Document from '../models/document.models.js';
import Flashcard from '../models/flashcard.models.js';
import Quiz from '../models/quiz.models.js';
import ChatHistory from '../models/chatHistory.models.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: true,
        statusCode: 404,
        error: 'Document Not Found or not ready',
      });
    }

    const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count));

    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });

    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcards generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 3, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Please provide document Id',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Document Not Found or not ready',
      });
    }

    const quizQuestions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions)
    );

    const quiz = await Quiz.create({
      documentId: document._id,
      userId: req.user._id,
      title: title || `${document.title} - Quiz`,
      questions: quizQuestions,
      totalQuestions: quizQuestions.length,
      userAnswer: [],
      score: 0,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: quiz,
      message: 'Quiz generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Please provide document Id',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Document Not Found or not ready',
      });
    }

    const summary = await geminiService.generateSummary(document.extractedText);

    return res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      statusCode: 200,
      data: {
        summary: summary,
        documentId: document._id,
        title: document.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Please provide documentId and question',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Document Not found or Not Ready',
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map((c) => c.chunkIndex);

    //get or create chat
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        documentId: document._id,
        userId: req.user._id,
        messages: [],
      });
    }

    const answer = await geminiService.chatWithContent(question, relevantChunks);

    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
      },
      {
        role: 'assistant',
        content: answer,
        relevantChunks: chunkIndices,
      }
    );

    await chatHistory.save();

    return res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistory: chatHistory._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const explainConcept = async (req, res, next) => {
  try {
    const {documentId, concept} = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Please provide document Id ans concept to explain',
      });
    }

    const document = await Document.findOne({
      userId: req.user._id,
      _id: documentId,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Document Not Found'
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, concept);

    const explanation = await geminiService.explainConcept(concept, relevantChunks);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    })
  } catch (error) {
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const {documentId} = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Please provide document Id',
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId
    });

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: [],
        message: 'No chat history found for this document'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: chatHistory.messages,
      message: 'Chat history retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export { generateFlashcards, generateQuiz, generateSummary, chat, explainConcept, getChatHistory };
