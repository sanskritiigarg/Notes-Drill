import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import quizService from '../../services/quiz.service';
import PageHeader from '../../components/common/PageHeader.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';

function QuizTakePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        if (response.data.userAnswers.length > 0) {
          navigate(`/quizzes/${quizId}/result`);
        }
        setQuiz(response.data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const question = quiz.questions.find((q) => q._id == questionId);
        const questionIndex = quiz.questions.findIndex((q) => q._id == questionId);
        const optionIndex = selectedAnswers[questionId];
        const selectedAnswer = question.options[optionIndex];
        return { questionIndex, selectedAnswer };
      });

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success('Quiz submitted successfully');
      navigate(`/quizzes/${quizId}/result`);
    } catch {
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg">Quiz not found or has no questions</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={quiz.title || 'Take Quiz'} />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-semibold">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-base font-semibold">{answeredCount} answered</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            className="absolute inset-y-0 left-0 bg-linear-to-r from-accent to-light rounded-full transition-all duration-500 ease-in-out"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="relative bg-linear-to-br to-primary/30 from-accent/20 backdrop-blur-sm border-2 rounded-2xl p-6 border-foreground/80 shadow-md shadow-primary hover:border-foreground hover:shadow-lg transition-all duration-200 mb-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/70 border-primary rounded-lg mb-4">
          <div className="w-2 h-2 rounded-full animate-pulse bg-foreground" />
          <span className="text-sm font-semibold">Question {currentQuestionIndex + 1}</span>
        </div>

        <h3 className="text-lg font-semibold mb-6 leading-relaxed">{currentQuestion.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;
            return (
              <label
                key={index}
                className={`group relative flex items-center p-3 border-2 rounded-xl cursor-pointer translate-0 duration-200 ${isSelected ? 'bg-secondary/40 shadow-md shadow-primary' : 'bg-gray-900 border-foreground/50 hover:bg-secondary/20 hover:border-foreground'}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => handleOptionChange(currentQuestion._id, index)}
                  className={`accent-light ${isSelected ? 'scale-125' : ''} transition-transform duration-200`}
                />

                <span
                  className={`ml-4 text-base font-medium transition-colors duration-200 ${isSelected ? 'font-semibold text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}
                >
                  {option}
                </span>

                {isSelected && (
                  <CheckCircle2 strokeWidth={2.5} className="ml-auto w-5 h-5 text-light" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-6 justify-between">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          className="group flex items-center gap-2 px-4 h-11 font-medium text-sm rounded-xl bg-accent/40 hover:bg-accent/80 transition-all duration-150 disabled:bg-accent/20 disabled:cursor-not-allowed"
        >
          <ChevronLeft
            strokeWidth={2}
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Previous
        </button>

        {currentQuestionIndex + 1 === quiz.questions.length ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting}>
            <span className="flex gap-2">
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 strokeWidth={2} />
                  Submit Quiz
                </>
              )}
            </span>
          </Button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={submitting}
            className="group flex items-center gap-2 px-5 h-11 font-medium text-sm rounded-xl bg-accent/40 hover:bg-accent/80 transition-all duration-150 disabled:bg-accent/20 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight
              strokeWidth={2}
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
            />
          </button>
        )}
      </div>

      <div className="mt-0 flex items-center justify-center gap-2 flex-wrap">
        {quiz.questions.map((_, index) => {
          const isAnsweredQuestion = selectedAnswers.hasOwnProperty(quiz.questions[index]._id);
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all duration-150 border border-accent ${isCurrent ? 'bg-accent' : isAnsweredQuestion ? 'bg-accent/60' : 'bg-gray-800'}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizTakePage;
