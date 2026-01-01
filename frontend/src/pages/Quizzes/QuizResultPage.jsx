import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';
import Button from '../../components/common/Button';

function QuizResultPage() {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await quizService.getQuizResults(quizId);
        setResults(response);
      } catch (error) {
        toast.error('Failed to fetch quiz results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  console.log(quiz);
  console.log(detailedResults);

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-accent to-light';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! ';
    if (score >= 80) return 'Great job! ';
    if (score >= 70) return 'Good work! ';
    if (score >= 60) return 'Not bad! ';
    return 'Keep Practicing! ';
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="inline-flex items-center gap-2 text-base text-light hover:text-accent transition-colors duration-100"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Score Card */}
      <div className="relative bg-linear-to-br to-primary/30 from-accent/20 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-lg shadow-primary mb-5">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-15 h-15 rounded-2xl bg-linear-to-br from-accent to-light shadow-md shadow-primary">
            <Trophy strokeWidth={2} className="w-8 h-8" />
          </div>

          <div>
            <p className="text-base font-semibold uppercase tracking-wide mb-2">Your Score</p>
            <div
              className={`inline-block text-4xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2`}
            >
              {score}%
            </div>
            <p className="text-lg font-medium">{getScoreMessage(score)}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-primary/80 border-secondary text-foreground/90">
              <Target strokeWidth={2} className="w-4 h-4 " />
              <span className="text-base font-semibold">{totalQuestions} Total</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-green-400/20 border-green-700 text-green-600">
              <CheckCircle2 strokeWidth={2} className="w-4 h-4" />
              <span className="text-base font-semibold">{correctAnswers} Correct</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-rose-400/20 border-red-700 text-red-600">
              <XCircle strokeWidth={2} className="w-4 h-4" />
              <span className="text-base font-semibold">{incorrectAnswers} Incorrect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen strokeWidth={2} className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Detailed Review</h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex((opt) => opt === result.selectedAnswer);
          const correctAnswerIndex =
            typeof result.correctAnswer === 'string' && result.correctAnswer.match(/^O\d+$/)
              ? Number(result.correctAnswer.slice(1)) - 1
              : result.options.indexOf(result.correctAnswer);

          const isCorrect = result.isCorrect;

          return (
            <div
              key={result.questionIndex}
              className="bg-gray-900 backdrop-blur-xl border-2 border-foreground/80 rounded-2xl p-6 shadow-md shadow-accent"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/60 border-primary rounded-lg mb-4">
                    <span className="text-sm font-semibold">Question {index + 1}</span>
                  </div>
                  <h4 className="text-lg font-semibold leading-relaxed">{result.question}</h4>
                </div>

                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isCorrect ? 'bg-green-400/20 border-green-700' : 'bg-rose-400/20 border-red-700 '}`}
                >
                  {isCorrect ? (
                    <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle strokeWidth={2} className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswerIndex;
                  const isUseranswer = optIndex === userAnswerIndex;
                  const isWrongAnswer = isUseranswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${isCorrectOption ? 'bg-green-400/20 border-green-700' : isWrongAnswer ? 'bg-rose-400/20 border-red-700' : 'bg-accent/20'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`text-base ${isCorrectOption ? 'text-green-600 font-semibold' : isWrongAnswer ? 'text-red-600 font-semibold' : 'font-medium'}`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="flex gap-2 text-green-600 font-medium items-center flex-wrap justify-center">
                              <CheckCircle2 strokeWidth={2.5} className="w-4 h-4" />
                              Correct
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span className="flex gap-2 text-red-600 font-medium items-center flex-wrap justify-center">
                              <XCircle strokeWidth={2.5} className="w-4 h-4" />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="p-4 bg-linear-to-br from-accent/30 to-light/40 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <BookOpen strokeWidth={2} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase tracking-wide mb-1">
                        Explanation
                      </p>
                      <p className="text-base leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${quiz.document._id}`}>
          <Button>
            <ArrowLeft strokeWidth={2} className="w-4 h-4" />
            Return to Document
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default QuizResultPage;
