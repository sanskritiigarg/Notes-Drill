import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import quizServices from '../../services/quiz.service.js';
import aiServices from '../../services/ai.service.js';
import Spinner from '../common/Spinner.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import QuizCard from './QuizCard';
import EmptyState from '../common/EmptyState.jsx';

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [numQuestions, setNumQuestions] = useState(1);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizServices.getAllQuizzes(documentId);
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiServices.generateQuiz(documentId, { numQuestions });
      toast.success('Quiz generated successfully');
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
      await quizServices.deleteQuiz(selectedQuiz._id);
      toast.success(`'${selectedQuiz.tittle || 'Quiz'}' deleted.`);
      setIsDeleteModalOpen(false);
      setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
      setSelectedQuiz(null);
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz');
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <div className="bg-gray-900 backdrop-blur-lg border rounded-3xl shadow-lg shadow-primary p-8">
          <EmptyState
            onClickAction={() => setIsGenerateModalOpen(true)}
            title="No Quizzes yet"
            description="Generate flashcards from your document to start learning and reinforce your knowledge."
            buttonText="Generate Quizzes"
            loading={generating}
            loadingText="Generating..."
          />
        </div>
      );
    }

    return (
      <div className="bg-gray-900 backdrop-blur-lg border rounded-3xl shadow-lg shadow-primary p-8">
        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={() => setIsGenerateModalOpen(true)}>
            <Plus size={16} />
            Generate Quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderQuizContent()}

      {/* Generate Quiz */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div>
            <label className="block text-base font-medium mb-1.5">Number of Questions</label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value)) || 1)}
              min="1"
              required
              className="w-full h-9 px-3 border-2 rounded-lg text-sm focus:outline-none focus:border-accent "
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={generating}>
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Quiz */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quiz?"
      >
        <div className="space-y-6">
          <p className="text-sm">
            Are you sure you want to delete the quiz:{' '}
            <span className="font-semibold text-base">{selectedQuiz?.title || 'this quiz'}</span>
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
                'Delete Quiz'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuizManager;
