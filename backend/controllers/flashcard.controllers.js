import Flashcard from '../models/flashcard.models.js';

const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate('document', 'title fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
    })
      .populate('document', 'title fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

const reviewFlashcards = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      userId: req.user._id,
      'cards._id': req.params.cardId,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Flashcard set or card Not Found',
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Card Not Found in set',
      });
    }

    const card = flashcardSet.cards[cardIndex];
    card.lastReviewed = new Date();
    card.reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Flashcard reviewed successfully',
    });
  } catch (error) {
    next(error);
  }
};

const toggleStarFlashcards = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      userId: req.user._id,
      'cards._id': req.params.cardId,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Flashcard Set or Card Not Found',
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Card Not Found in set',
      });
    }

    const card = flashcardSet.cards[cardIndex];
    card.isStarred = !card.isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Flashcard is ${card.isStarred ? 'starred' : 'unstarred'}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({ _id: req.params.id, userId: req.user._id });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'FlashcardSet  Not Found',
      });
    }

    await flashcardSet.deleteOne();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Flashcard deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  getFlashcards,
  getAllFlashcards,
  reviewFlashcards,
  toggleStarFlashcards,
  deleteFlashcardSet,
};
