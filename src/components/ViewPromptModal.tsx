import React, { useState, useRef } from 'react';
import { X, Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ViewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  prompt: {
    title: string;
    content: string;
    category: string;
    created_at: string;
  };
}

export function ViewPromptModal({ isOpen, onClose, onEdit, onDelete, prompt }: ViewPromptModalProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseDownOutside, setMouseDownOutside] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setIsCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

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
      <div ref={modalRef} className="bg-white/10 backdrop-blur-lg rounded-xl w-full max-w-2xl border border-white/20 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start p-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">{prompt.title}</h2>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
              {prompt.category}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="text-white/60 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {isCopied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>
            <button 
              onClick={onEdit}
              className="text-white/60 hover:text-white transition-colors"
              title="Edit prompt"
            >
              <Pencil size={20} />
            </button>
            <button 
              onClick={onDelete}
              className="text-white/60 hover:text-red-400 transition-colors"
              title="Delete prompt"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors ml-2"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/80 whitespace-pre-wrap">{prompt.content}</p>
            </div>
            <div className="text-sm text-white/40">
              Created on {new Date(prompt.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}