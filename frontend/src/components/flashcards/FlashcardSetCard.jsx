import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import moment from 'moment';

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/flashcards/${flashcardSet._id}`);
  };

  const reviewedCount = flashcardSet.cards.filter((card) => card.lastReviewed).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      onClick={handleStudyNow}
      className="group relative bg-linear-to-br to-primary/30 from-accent/20 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer border-foreground/60 shadow-sm shadow-primary hover:border-foreground hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-accent to-light">
            <BookOpen strokeWidth={2} className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold line-clamp-2 mb-1"
              title={flashcardSet?.documentId?.title || 'Flashcard'}
            >
              {flashcardSet?.documentId?.title || 'Flashcard'}
            </h3>
            <p className="text-xs font-medium uppercase tracking-wide">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 pt-2">
          <div className="px-3 py-1 rounded-lg border bg-secondary/70 border-primary">
            <span className="text-sm font-semibold">
              {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
            </span>
          </div>
          {reviewedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-primary/60 border-primary">
              <TrendingUp strokeWidth={2.5} className="h-5 w-5" />
              <span className="text-sm font-semibold">{progressPercentage}%</span>
            </div>
          )}
        </div>

        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium opacity-90">Progress</span>
              <span className="text-sm font-medium">
                {reviewedCount}/{totalCards} reviewed
              </span>
            </div>
            <div className="relative h-2.5 bg-black rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="absolute inset-y-0 bg-linear-to-r from-accent to-light rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-2">
        <button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="h-11 border rounded-lg bg-accent/60 hover:bg-accent border-accent transition-all duration-200 w-full"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles strokeWidth={2.5} className="w-4 h-4" />
            Study Now
          </span>
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
