import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import documentServices from '../../services/document.service.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Tabs from '../../components/documents/Tabs.jsx';
import ChatInterface from '../../components/tabs/ChatInterface.jsx';
import AIActions from '../../components/tabs/AIActions.jsx';
import FlashcardManager from '../../components/flashcards/FlashcardManager.jsx';
import QuizManager from '../../components/quizzes/QuizManager.jsx';

function DocDetailPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDocument = async () => {
      try {
        const result = await documentServices.getDocumentById(id);
        setDocument(result.data);
      } catch (error) {
        console.error(error);
        toast.error(error.error || 'Failed to fetch document details');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const getPDFUrl = () => {
    if (!document?.filePath) return null;

    const filePath = document.filePath;

    if (filePath.startsWith('http')) {
      return filePath;
    }

    const baseURL = process.env.REACT_APP_API_URL;
    const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;

    return `${baseURL}${normalizedPath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.filePath) {
      return <div className="text-center p-8">PDF not available</div>;
    }

    const pdfUrl = getPDFUrl();

    return (
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-md font-medium">Document Viewer</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-shadow-md text-blue-300 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            <ExternalLink size={16} />
            Open in new Tab
          </a>
        </div>

        <div className="p-2">
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh] rounded"
            title="PDF Viewer"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIActions = () => {
    return <AIActions />;
  };

  const renderFlashcards = () => {
    return <FlashcardManager documentId={id} />;
  };

  const renderQuizzes = () => {
    return <QuizManager documentId={id} />;
  };

  const tabs = [
    {
      name: 'Content',
      label: 'Content',
      content: renderContent(),
    },
    {
      name: 'Chat',
      label: 'Chat',
      content: renderChat(),
    },
    {
      name: 'AI Actions',
      label: 'AI Actions',
      content: renderAIActions(),
    },
    {
      name: 'Flashcards',
      label: 'Flashcards',
      content: renderFlashcards(),
    },
    {
      name: 'Quizzes',
      label: 'Quizzes',
      content: renderQuizzes(),
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="text-center p-8">Document not found</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-md text-light hover:text-accent transition-colors duration-100"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      <PageHeader title={document.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default DocDetailPage;
