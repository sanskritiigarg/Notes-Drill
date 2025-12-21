import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, Clock, Dock, BrainCircuit } from 'lucide-react';
import moment from 'moment';
import { doc } from 'prettier';

const formatFilesize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-gray-900 backdrop-blur-3xl border rounded-2xl p-5 shadow-primary shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:bg-secondary/30"
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="shrink-0 w-12 h-12 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center  shadow-md shadow-secondary group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6" strokeWidth={2} />
          </div>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 justify-center hover:bg-red-500 transition-colors duration-200 p-2 rounded-lg"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Title */}
        <h3 title={document.title} className="text-base font-semibold truncate mb-2">
          {document.title}
        </h3>

        {/* Doc Info */}
        <div className="flex items-center gap-3 text-sm mb-3">
          {document.fileSize !== undefined && (
            <>
              <span className="font-medium">{formatFilesize(document.fileSize)}</span>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-3">
          {document.flashcardCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-accent/60">
              <Dock strokeWidth={2} className="w-6 h-6 text-foreground/80" />
              <span className="font-semibold text-sm ">{document.flashcardCount} Flashcards</span>
            </div>
          )}
          {document.quizCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-light/70">
              <BrainCircuit strokeWidth={2} className="w-6 h-6 text-foreground/80" />
              <span className="font-semibold text-sm">{document.quizCount} Quizzes</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t opacity-70">
        <div className="flex items-center gap-1.5 text-sm ">
          <Clock strokeWidth={2} className="h-4 w-4" />
          <span>Uploaded {moment(document.createdAt).fromNow()}</span>
        </div>
      </div>

      <div />
    </div>
  );
};

export default DocumentCard;
