import React, { useEffect, useState } from 'react';
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner.jsx';
import documentServices from '../../services/document.service.js';
import Button from '../../components/common/Button.jsx';
import DocumentCard from '../../components/documents/DocumentCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

const DocListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const hasFetched = React.useRef(false);

  const fetchDocuments = async () => {
    try {
      const fetchedData = await documentServices.getDocuments();
      setDocuments(fetchedData.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error('Please provide a title and select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);

    try {
      await documentServices.upload(formData);
      toast.success('Document uploaded successfully');
      setUploadFile(null);
      setUploadTitle('');
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
    handleConfirmDelete();
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    if (window.confirm('Do you really want to delete this document')) {
      setDeleting(true);
      try {
        await documentServices.deleteDoc(selectedDoc._id);
        toast.success(`${selectedDoc.title} deleted`);
        setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
        setSelectedDoc(null);
        setIsDeleteModalOpen(false);
      } catch (error) {
        toast.error(error.error || 'Failed to delete document');
      } finally {
        setDeleting(false);
      }
    }
  };

  const closeDialog = () => {
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadFile(null);
    fetchDocuments();
  };

  const renderUploadDialog = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="relative w-full max-w-lg border-2 rounded-2xl shadow-2xl bg-black p-8">
          {/* Close Button */}
          <button
            onClick={closeDialog}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent/60 transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-medium tracking-tight">Upload New Document</h2>
            <p className="text-sm mt-1">Add a PDF document to your library</p>
          </div>

          <form className="space-y-5" onSubmit={handleUpload}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-wide">
                Document Title
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full h-12 px-4 border-2 rounded-xl text-md font-medium focus:outline-none focus:border-accent"
                placeholder="e.g., React Interview Prep"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-wide">
                PDF File
              </label>

              <div className="relative border-2 border-dashed rounded-xl hover:border-accent hover:bg-primary/40 transition-all duration-200">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center py-10 px-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-r from-primary to-accent flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" strokeWidth={2} />
                  </div>

                  <p className="text-sm font-medium mb-1">
                    {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm">PDF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={uploading}
                onClick={closeDialog}
                className="flex-1 h-11 border-2 rounded-xl font-semibold hover:bg-red-400 transition-all duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="flex-1 h-11 border-2 rounded-xl font-semibold hover:bg-primary hover:border-accent transition-all duration-200"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-t-accent rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight mb-2">My Documents</h1>
            <p className="text-sm">Manage and organize your learning materials</p>
          </div>

          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus strokeWidth={2.5} className="h-4 w-4" />
              Upload Document
            </Button>
          )}
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <DocumentCard key={doc._id} document={doc} onDelete={handleDeleteRequest} />
            ))}
          </div>
        ) : (
          <EmptyState
            onClickAction={() => setIsUploadModalOpen(true)}
            title="No Documents yet"
            description="Get started by uploading your first PDF document to begin learning"
            buttonText="Upload Document"
          />
        )}

        {isUploadModalOpen && renderUploadDialog()}
      </div>
    </div>
  );
};

export default DocListPage;
