import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        px-4 py-3 rounded-xl shadow-lg
        text-sm font-medium
        animate-fade-in
        ${
          type === 'success'
            ? 'bg-green-500/90 text-white'
            : 'bg-red-500/90 text-white'
        }
      `}
    >
      {message}
    </div>
  );
}