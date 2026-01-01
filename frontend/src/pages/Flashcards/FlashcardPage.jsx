import React, { useEffect, useRef, useState } from 'react';
import flashcardService from '../../services/flashcards.service';
import Spinner from '../../components/common/Spinner';
import { useParams } from 'react-router-dom';
import FlashcardViewer from '../../components/flashcards/FlashcardViewer';
import toast from 'react-hot-toast';

function FlashcardPage() {
  const { id } = useParams();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchFlashcardSet = async () => {
      setLoading(true);
      try {
        const response = await flashcardService.getFlashcardById(id);
        console.log(response.data);

        setFlashcardSet(response.data);
      } catch (error) {
        toast.error('Failed to fetch flashcards set.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, []);

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.starFlashcard(cardId);
      const updatedCards = flashcardSet.cards.map((card) =>
        card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
      );
      setFlashcardSet((prev) => ({ ...prev, cards: updatedCards }));
      toast.success('Card starred status updated');
    } catch (error) {
      toast.error('Failed to star flashcard.');
    }
  };

  if (loading) {
    return <Spinner />;
  }


  return (
    <div>
      <FlashcardViewer
        selectedSet={flashcardSet}
        handleToggleStar={handleToggleStar}
        currentCardIndex={currentCardIndex}
        setCurrentCardIndex={setCurrentCardIndex}
      />
    </div>
  );
}

export default FlashcardPage;
