import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart2, Trash2, Award } from 'lucide-react';
import moment from 'moment';

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-linear-to-br to-primary/30 from-accent/20 backdrop-blur-sm border rounded-2xl p-6 border-foreground/60 shadow-sm shadow-primary hover:border-foreground hover:shadow-md transition-all duration-200">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="opacity-0 group-hover:opacity-100 justify-center hover:bg-red-500 transition-colors duration-200 rounded-lg absolute top-4 right-4 p-2"
      >
        <Trash2 className="w-5 h-5" strokeWidth={2} />
      </button>

      <div className="space-y-4">
        {/* Status badge */}
        <div className="inline-flex items-center gap-1.5 py-1 rounded-lg text-sm font-semibold">
          <div className="flex items-center gap-1.5 border rounded-lg px-3 py-1 bg-primary border-secondary">
            <Award className="w-4 h-4" strokeWidth={2} />
            <span>Score: {quiz?.score}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1 line-clamp-2" title={quiz.title}>
            {quiz.title || `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}`}
          </h3>
          <p className="text-xs font-medium uppercase tracking-wide">
            Created {moment(quiz.createdAt).format('MMM D, YYYY')}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-foreground/40">
          <div className="px-3 py-1 border rounded-lg bg-secondary/70 border-primary">
            <span className="text-base font-semibold">
              {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-2 pt-4 border-t border-foreground/40">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/result`}>
            <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 border rounded-lg bg-primary/60 hover:bg-accent border-secondary transition-all duration-200">
              <BarChart2 strokeWidth={2} className="w-4 h-4" />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className=" h-11 border rounded-lg bg-accent/60 hover:bg-accent border-accent transition-all duration-200 w-full">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" strokeWidth={2} />
                Start Quiz
              </span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
