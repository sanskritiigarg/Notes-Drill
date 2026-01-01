import React, { use, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import aiServices from '../../services/ai.service';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Modal from '../common/Modal.jsx';

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [concept, setConcept] = useState('');

  const handleGenerateSummary = async () => {
    setLoadingAction('summary');
    try {
      const response = await aiServices.generateSummary(documentId);
      setModalTitle('Generated Summary');
      setModalContent(response.data.summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error('Please enter a concept to explain');
      return;
    }
    setLoadingAction('explain');
    try {
      const response = await aiServices.explainConcept(documentId, concept);
      setModalTitle(`Explanation of ${concept}`);
      setModalContent(response.data.explanation);
      setIsModalOpen(true);
      setConcept('');
    } catch (error) {
      toast.error('Failed to explain concept');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="border rounded-2xl shadow-lg shadow-primary overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-linear-to-br to-primary/30 from-accent/20 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent to-light shadow-accent shadow-md flex items-center justify-center">
              <Sparkles className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Notes Drill</h3>
              <p className="text-sm">Powered by Advanced AI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="group p-5 bg-linear-to-br to-primary/30 from-accent/20 rounded-xl border border-foreground/60 shadow-sm shadow-primary hover:border-foreground hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-light flex items-center justify-center">
                    <BookOpen strokeWidth={2} className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold">Generate Summary</h4>
                </div>
                <p className="text-base leading-relaxed">
                  Get a concise summary of the entire document.
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === 'summary'}
                className="shrink-0 h-10 px-5 flex items-center gap-2 bg-linear-to-r from-accent to-light hover:to-light/80 font-semibold rounded-xl transition-all duration-200 shadow-md shadow-accent disabled:opacity-60 disabled:cursor-not-allowed active:scale-90"
              >
                {loadingAction === 'summary' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading</span>
                  </>
                ) : (
                  'Summarize'
                )}
              </button>
            </div>
          </div>

          {/* Explain concept */}
          <div className="group p-5 bg-linear-to-br to-primary/30 from-accent/20 rounded-xl border border-foreground/60 shadow-sm shadow-primary hover:border-foreground hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-light flex items-center justify-center">
                    <Lightbulb strokeWidth={2} className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold">Explain a Concept</h4>
                </div>
                <p className="text-base leading-relaxed mb-2">
                  Enter a topic from the document to get a detailed explanation.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g. React Hooks"
                    className="flex-1 h-10 px-4 py-2 border border-foreground/80 rounded-xl bg-gray-900/40 focus:outline-none focus:border-accent transition-all duration-200"
                    disabled={loadingAction === 'explain'}
                  />
                  <button
                    onClick={handleExplainConcept}
                    disabled={loadingAction === 'explain' || !concept.trim()}
                    className="shrink-0 h-10 px-5 flex items-center gap-2 bg-linear-to-r from-accent to-light hover:to-light/80 font-semibold rounded-xl transition-all duration-200 shadow-md shadow-accent disabled:opacity-60 disabled:cursor-not-allowed active:scale-90"
                  >
                    {loadingAction === 'explain' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading</span>
                      </>
                    ) : (
                      'Explain'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <div className="max-h-[70vh] overflow-y-auto max-w-[70wh] prose prose-sm">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;
