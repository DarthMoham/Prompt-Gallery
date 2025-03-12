import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CategoryCombobox } from './CategoryCombobox';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (prompt: { title: string; content: string; category: string }) => void;
}

export function AddPromptModal({ isOpen, onClose, onAdd }: AddPromptModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('category');

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => item.category))].sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, content, category });
    setTitle('');
    setContent('');
    setCategory('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl w-full max-w-lg border border-white/20 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-semibold text-white">Add New Prompt</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Prompt content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 min-h-[200px] resize-y"
                required
              />
            </div>
            <CategoryCombobox
              value={category}
              onChange={setCategory}
              categories={categories}
            />
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              Save Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}