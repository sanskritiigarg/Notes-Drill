import React from 'react';
import Flashcard from './Flashcard.jsx';
import flashcardServices from '../../services/flashcards.service.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const FlashcardViewer = ({
  selectedSet,
  currentCardIndex,
  setCurrentCardIndex,
  handleToggleStar,
}) => {
  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % selectedSet.cards.length);
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async (index) => {
    const currCard = selectedSet?.cards[currentCardIndex];
    if (!currCard) return;

    try {
      await flashcardServices.reviewFlashcard(currCard._id);
      toast.success('Flashcard reviewed');
    } catch (error) {
      toast.error('Failed to review flashcard.');
    }
  };

  const currentCard = selectedSet.cards[currentCardIndex];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="w-full max-w-2xl">
        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handlePrevCard}
          disabled={selectedSet.cards.length <= 1}
          className="group flex items-center gap-2 px-4 h-11 font-medium text-sm rounded-xl bg-accent/40 hover:bg-accent/80 transition-all duration-150 disabled:bg-accent/20 disabled:cursor-not-allowed"
        >
          <ChevronLeft
            strokeWidth={2}
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Previous
        </button>

        <div className="border py-2 px-4 rounded-lg border-foreground/70 bg-gray-800">
          <span>
            {currentCardIndex + 1} <span>/</span> {selectedSet.cards.length}
          </span>
        </div>

        <button
          onClick={handleNextCard}
          disabled={selectedSet.cards.length <= 1}
          className="group flex items-center gap-2 px-5 h-11 font-medium text-sm rounded-xl bg-accent/40 hover:bg-accent/80 transition-all duration-150 disabled:bg-accent/20 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight
            strokeWidth={2}
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
          />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
