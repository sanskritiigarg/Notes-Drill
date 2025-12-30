import React, { useState } from 'react';
import { Star, RotateCcw } from 'lucide-react';

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div style={{ perspective: '1000px' }} className="relative w-full h-72">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full border-2 rounded-2xl shadow-md shadow-accent bg-linear-to-br to-primary/40 from-accent/40 backdrop-blur-sm p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Star Button */}
          <div className="flex items-start justify-between">
            <div className="rounded px-4 py-1 uppercase bg-primary/40">{flashcard?.difficulty}</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200
                ${
                  flashcard.isStarred
                    ? 'bg-linear-to-br from-amber-400 to-yellow-500 text-yellow-600 shadow-md shadow-amber-500/40'
                    : 'bg-amber-200/40 hover:text-yellow-400'
                }`}
            >
              <Star
                strokeWidth={2}
                className="w-6 h-6 "
                fill={flashcard.isStarred ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-lg font-semibold text-center leading-relaxed">
              {flashcard.question}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <RotateCcw className="w-4 h-5" strokeWidth={2} />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full border-2 rounded-2xl bg-linear-to-br to-primary/20 from-accent/20 backdrop-blur-sm p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Star Button */}
          <div className="flex items-start justify-between">
            <div className="rounded px-4 py-1 uppercase bg-primary/40">{flashcard?.difficulty}</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200
                ${
                  flashcard.isStarred
                    ? 'bg-linear-to-br from-amber-400 to-yellow-500 text-yellow-600 shadow-md shadow-amber-500/40'
                    : 'bg-amber-200/40 hover:text-yellow-400'
                }`}
            >
              <Star
                strokeWidth={2}
                className="w-6 h-6 "
                fill={flashcard.isStarred ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Answer Content */}
          <div lassName="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-md font-semibold text-center leading-relaxed">{flashcard.answer}</p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <RotateCcw className="w-4 h-5" strokeWidth={2} />
            <span>Click to reveal answer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
