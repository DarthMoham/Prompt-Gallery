import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CategoryCombobox } from './CategoryCombobox';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (prompt: { title: string; content: string; category: string }) => void;
}

function toInitialCaps(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function AddPromptModal({ isOpen, onClose, onAdd }: AddPromptModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('category');

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => toInitialCaps(item.category)))].sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({ title: title.trim(), content: content.trim(), category: toInitialCaps(category.trim()) });
      setTitle('');
      setContent('');
      setCategory('');
      setErrors({});
      onClose();
    }
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
                placeholder="Title *"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({ ...errors, title: '' });
                }}
                className={`w-full bg-white/5 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>
            <div>
              <textarea
                placeholder="Prompt content *"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setErrors({ ...errors, content: '' });
                }}
                className={`w-full bg-white/5 border ${errors.content ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 min-h-[200px] resize-y`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-400">{errors.content}</p>
              )}
            </div>
            <div>
              <CategoryCombobox
                value={category}
                onChange={(value) => {
                  setCategory(value);
                  setErrors({ ...errors, category: '' });
                }}
                categories={categories}
                placeholder="Category *"
                error={errors.category}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category}</p>
              )}
            </div>
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