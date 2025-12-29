import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        ></div>

        <div className="relative w-full max-w-lg bg-black/80 border rounded-2xl shadow-2xl p-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-accent/40 hover:bg-accent/70 transition-all duration-200"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          <div className="mb-6 pr-8 border-b pb-2">
            <h3 className="text-xl font-medium tracking-tight">{title}</h3>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
