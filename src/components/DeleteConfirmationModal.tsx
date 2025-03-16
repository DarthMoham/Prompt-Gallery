import React, { useRef, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  promptTitle: string;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, promptTitle }: DeleteConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseDownOutside, setMouseDownOutside] = useState(false);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMouseDownOutside(true);
    } else {
      setMouseDownOutside(false);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && mouseDownOutside) {
      onClose();
    }
    setMouseDownOutside(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div ref={modalRef} className="bg-white/10 backdrop-blur-lg rounded-xl w-full max-w-md border border-white/20">
        <div className="flex justify-between items-start p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Delete Prompt</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-6 pb-6">
          <p className="text-white/80 mb-6">
            Are you sure you want to delete "<span className="text-white">{promptTitle}</span>"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}