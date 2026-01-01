import React, { useRef, useState, useEffect } from 'react';
import flashcardService from '../../services/flashcards.service';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import toast from 'react-hot-toast';

function FlashcardListPage() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchFlashcardsSets = async () => {
      setLoading(true);
      try {
        const response = await flashcardService.getAllFlashcards();
        setFlashcardSets(response.data);
      } catch (error) {
        toast.error('Failed to fetch flashcard sets.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcardsSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No Flashcards yet"
          description="Generate flashcards from your document to start learning and reinforce your knowledge."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcardSets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="All Flashcard Sets" />
      {renderContent()}
    </div>
  );
}

export default FlashcardListPage;
