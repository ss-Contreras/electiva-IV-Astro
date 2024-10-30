// ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  error: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose }) => {
  return (
    <div
      className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <span>{error}</span>
      <span
        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
        onClick={onClose}
      >
        ×
      </span>
    </div>
  );
};

export default ErrorMessage;
