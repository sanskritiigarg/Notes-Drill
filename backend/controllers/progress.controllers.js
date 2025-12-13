import Document from '../models/document.models.js';
import Flashcard from '../models/flashcard.models.js';
import Quiz from '../models/quiz.models.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get overall counts
    const documentCount = await Document.countDocuments({ userId });
    const flashcardsetCount = await Flashcard.countDocuments({ userId });
    const quizzesCount = await Flashcard.countDocuments({ userId });

    // Get flashcard statistics
    const flashcardSets = await Flashcard.find({ userId });
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter((c) => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter((c) => c.isStarred).length;
    });

    // Get quiz statistics
    const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
    const completedQuizzes = quizzes.length;
    const averageScore =
      quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0)) : 0;

    // Get recent activity
    const recentDocuments = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select('title lastAccessed createdAt');

    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('documentId', 'title')
      .select('title score totalQuestions completedAt createdAt');

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        overview: {
          documentCount,
          flashcardsetCount,
          quizzesCount,
        },
        flashcardOverview: {
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
        },
        quizzesOverview: {
          completedQuizzes,
          averageScore,
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
