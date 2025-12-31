import React from 'react';
import Button from './Button';
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({ onClickAction, title, description, buttonText, loading, loadingText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-accent to-light mb-6">
        <FileText strokeWidth={2} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-md mb-8 text-center max-w-sm">{description}</p>
      <Button onClick={onClickAction} disabled={loading} size="md">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            <Plus strokeWidth={2} className="w-6 h-6" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
};

export default EmptyState;
