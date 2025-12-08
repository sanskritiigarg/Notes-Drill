import Quiz from '../models/quiz.models.js';

const getQuizzes = async (req, res, next) => {
  try {
    const {documentId} = req.params;

    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId: documentId,
    })
    .populate('documentId', 'fileName title')
    .sort({createdAt: -1});

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const {id} = req.params;

    const quiz =await Quiz.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Quiz Not Found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {answers} = req.body;

    if (!Array.isArray(answers))  {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Answers should be an array'
      });
    }

    const quiz = await Quiz.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Quiz Not Found'
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Quiz is already completed'
      });
    }

    let correctCount = 0;
    const userAnswers = [];

    answers.forEach(answer => {
      const {questionIndex, selectedAnswer} = answer;

      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex];
        const isCorrect = question.correctAnswer === selectedAnswer;

        if (isCorrect) correctCount++;

        userAnswers.push({
          questionIndex,
          selectedAnswer,
          isCorrect,
          answeredAt: new Date()
        });
      }
    });

    quiz.score = Math.round((correctCount / quiz.totalQuestions) * 100);
    quiz.userAnswers = userAnswers;
    quiz.completedAt = new Date();

    await quiz.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        quizId: quiz._id,
        score: quiz.score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        userAnswers
      },
      message: 'Quiz completed successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getQuizResults = async (req, res, next) => {
  try {
    const {id} = req.params;

    const quiz = await Quiz.findOne({
      _id: id,
      userId: req.user._id
    })
    .populate('documentId', 'fileName title');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Quiz Not Found'
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: 'Quiz is not completed yet'
      });
    }

    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || false
      }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.documentId,
          title: quiz.title,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt
        },
        results: detailedResults
      }
    })
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const {id} = req.params;

    const quiz = await Quiz.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'Quiz Not Found'
      });
    }

    await quiz.deleteOne();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export { getQuizzes, getQuizById, submitQuiz, getQuizResults, deleteQuiz };
