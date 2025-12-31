import React, { useRef, useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, ArrowLeft, Sparkles, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import flashcardServices from '../../services/flashcards.service.js';
import aiServices from '../../services/ai.service.js';
import Spinner from '../common/Spinner.jsx';
import Modal from '../common/Modal.jsx';
import Flashcard from './Flashcard.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const hasFetched = useRef(false);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardServices.getFlashcards(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error('Failed to fetch flashcards sets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    if (documentId) {
      fetchFlashcardsSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiServices.generateFlashcards(documentId);
      toast.success('Flashcards generated successfully');
      fetchFlashcardsSets();
    } catch (error) {
      toast.error(error.error || 'Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

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

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardServices.starFlashcard(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success('Card starred status updated');
    } catch (error) {
      toast.error('Failed to star flashcard.');
    }
  };

  const handleDeleteRequest = async (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardServices.deleteFlashcard(setToDelete._id);
      toast.success('Flashcard set deleted successfully');
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardsSets();
    } catch (error) {
      toast.error(error.message || 'Failed to delete flashcard set.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8">
        <button
          onClick={() => setSelectedSet(null)}
          className="inline-flex items-center gap-2 text-md text-light hover:text-accent transition-colors duration-100"
        >
          <ArrowLeft strokeWidth={2} />
          Back to Sets
        </button>

        {/* Flashcard Display */}
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
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          onClickAction={handleGenerateFlashcards}
          title="No Flashcards yet"
          description="Generate flashcards from your document to start learning and reinforce your knowledge."
          buttonText="Generate Flashcards"
          loading={generating}
          loadingText="Generating..."
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-semibold">Your Flashcard Sets</h3>
            <p className="text-md">
              {flashcardSets.length} {flashcardSets.length === 1 ? 'set' : 'sets'} available
            </p>
          </div>
          <Button onClick={handleGenerateFlashcards} disabled={generating} size="md">
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles strokeWidth={2} className="w-6 h-6" />
                Generate New Set
              </>
            )}
          </Button>
        </div>

        {/* Flashcard Sets grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-linear-to-br to-primary/30 from-accent/20 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer border-foreground/60 shadow-sm shadow-primary hover:border-foreground hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="opacity-0 group-hover:opacity-100 justify-center hover:bg-red-500 transition-colors duration-200 rounded-lg absolute top-4 right-4 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {/* set Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-light mb-6">
                  <Brain strokeWidth={2} className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-1">Flashcard Set</h4>
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Created {moment(set.createdAt).format('MMM D, YYYY')}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-foreground/50">
                  <div className="px-3 py-1 rounded-lg border bg-secondary/70 border-primary">
                    <span className="text-sm font-semibold">
                      {set.cards.length} {set.cards.length === 1 ? 'card' : 'cards'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-900 backdrop-blur-lg border rounded-3xl shadow-lg shadow-primary p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={'Delete Flashcard Set?'}
      >
        <div className="space-y-6">
          <p className="text-sm">
            Are you sure you want to delete this flashcard set? This action cannot be undon and all
            cards will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              className="p-2 border-2 rounded-xl font-semibold hover:bg-accent/80 transition-all duration-200"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="p-2 border-2 rounded-xl font-semibold bg-red-600 hover:bg-red-500 transition-all duration-200"
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                'Delete Set'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
