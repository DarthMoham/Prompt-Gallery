import React, { useState } from 'react';
import { Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { EditPromptModal } from './EditPromptModal';
import { ViewPromptModal } from './ViewPromptModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

// Declare gtag on the window object for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string, prompt: { title: string; content: string; category: string }) => void;
  onCategoryClick: (category: string) => void;
}

export function PromptCard({ prompt, onDelete, onEdit, onCategoryClick }: PromptCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
      setIsCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
      // Track GA4 event for copying prompt from card
      window.gtag('event', 'copy_prompt_card', {
        category: prompt.category,
      });
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleEdit = (updatedPrompt: { title: string; content: string; category: string }) => {
    onEdit(prompt.id, updatedPrompt);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
    // Track GA4 event for opening edit modal from card
    window.gtag('event', 'open_edit_modal_card', {
      category: prompt.category,
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
    // Track GA4 event for opening delete modal from card
    window.gtag('event', 'open_delete_modal_card', {
      category: prompt.category,
    });
  };

  const handleConfirmDelete = () => {
    onDelete(prompt.id);
    setIsDeleteModalOpen(false);
    if (isViewModalOpen) {
      setIsViewModalOpen(false);
    }
    // Note: The actual delete success event is tracked in App.tsx where the API call happens
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCategoryClick(prompt.category);
    // Track GA4 event for category chip click
    window.gtag('event', 'category_chip_click', {
      category: prompt.category,
    });
  };

  const handleOpenViewModal = () => {
    setIsViewModalOpen(true);
    // Track GA4 event for opening view modal from card
    window.gtag('event', 'open_view_modal_card', {
      category: prompt.category,
    });
  };

  return (
    <>
      <div
        className="group bg-white/[0.07] hover:bg-white/[0.09] backdrop-blur-lg rounded-xl p-6 transition-all duration-300 border border-white/[0.07] hover:border-blue-500/30 cursor-pointer relative overflow-hidden"
        onClick={handleOpenViewModal}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{prompt.title}</h3>
              <button
                onClick={handleCategoryClick}
                className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm hover:bg-cyan-500/30 transition-colors"
              >
                {prompt.category}
              </button>
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
                onClick={handleEditClick}
                className="text-white/60 hover:text-white transition-colors"
                title="Edit prompt"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-white/60 hover:text-red-400 transition-colors"
                title="Delete prompt"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <p className="text-white/80 line-clamp-3">{prompt.content}</p>
          <div className="mt-4 text-sm text-white/40">
            {new Date(prompt.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <EditPromptModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          // Track GA4 event for closing edit modal
          window.gtag('event', 'close_edit_modal', { category: prompt.category });
        }}
        onEdit={handleEdit}
        prompt={prompt}
      />

      <ViewPromptModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          // Track GA4 event for closing view modal
          window.gtag('event', 'close_view_modal', { category: prompt.category });
        }}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
          // Track GA4 event for clicking edit from view modal
          window.gtag('event', 'edit_from_view_modal', { category: prompt.category });
        }}
        onDelete={() => {
          setIsDeleteModalOpen(true);
          // Track GA4 event for clicking delete from view modal
          window.gtag('event', 'delete_from_view_modal', { category: prompt.category });
        }}
        prompt={prompt}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          // Track GA4 event for closing delete confirmation modal
          window.gtag('event', 'close_delete_modal', { category: prompt.category });
        }}
        onConfirm={handleConfirmDelete}
        promptTitle={prompt.title}
      />
    </>
  );
}