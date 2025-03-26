import React, { useState, useEffect, useRef } from 'react';
import { X, Wand2, Check, ArrowLeft } from 'lucide-react';
import { CategoryCombobox } from './CategoryCombobox';
import { enhancePrompt, fetchCategories } from '../lib/api';
import { toast } from 'react-hot-toast';
import { toInitialCaps } from '../lib/utils';

interface EditPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (prompt: { title: string; content: string; category: string }) => void;
  prompt: {
    title: string;
    content: string;
    category: string;
  };
}

export function EditPromptModal({ isOpen, onClose, onEdit, prompt }: EditPromptModalProps) {
  const [title, setTitle] = useState(prompt.title);
  const [content, setContent] = useState(prompt.content);
  const [enhancedContent, setEnhancedContent] = useState('');
  const [category, setCategory] = useState(prompt.category);
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mouseDownOutside, setMouseDownOutside] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const handleEnhancePrompt = async () => {
    if (!content.trim()) {
      setErrors({ ...errors, content: 'Please enter content before enhancing' });
      return;
    }

    try {
      setIsEnhancing(true);
      const enhanced = await enhancePrompt(content);
      setEnhancedContent(enhanced);
      setShowComparison(true);
      toast.success('Prompt enhanced! Choose which version you prefer or edit either one.', {
        duration: 5000,
      });
    } catch (error) {
      toast.error('Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAcceptEnhanced = () => {
    setContent(enhancedContent);
    setEnhancedContent('');
    setShowComparison(false);
    toast.success('Enhanced version accepted!');
  };

  const handleKeepOriginal = () => {
    setEnhancedContent('');
    setShowComparison(false);
    toast.success('Keeping original version');
  };

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
      // If we have an enhanced version and we're in comparison mode, use it by default
      const finalContent = showComparison && enhancedContent ? enhancedContent : content;
      onEdit({ 
        title: title.trim(), 
        content: finalContent.trim(), 
        category: toInitialCaps(category.trim()) 
      });
      setErrors({});
      setShowComparison(false);
      onClose();
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
      <div ref={modalRef} className="bg-white/10 backdrop-blur-lg rounded-xl w-full max-w-lg border border-white/20 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-semibold text-white">Edit Prompt</h2>
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
            
            {showComparison ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-white/80 mb-2 flex items-center gap-2">
                    Original Prompt
                    <button
                      type="button"
                      onClick={handleKeepOriginal}
                      className="ml-auto text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Keep Original
                    </button>
                  </h3>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 min-h-[150px] resize-y"
                  />
                </div>
                <div>
                  <h3 className="text-white/80 mb-2 flex items-center gap-2">
                    Enhanced Version
                    <button
                      type="button"
                      onClick={handleAcceptEnhanced}
                      className="ml-auto text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Check size={16} />
                      Use Enhanced
                    </button>
                  </h3>
                  <textarea
                    value={enhancedContent}
                    onChange={(e) => setEnhancedContent(e.target.value)}
                    className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 min-h-[150px] resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <textarea
                  placeholder="Prompt content *"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setErrors({ ...errors, content: '' });
                  }}
                  className={`w-full bg-white/5 border ${errors.content ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 min-h-[200px] resize-y pr-12`}
                />
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="absolute top-2 right-2 p-2 text-white/60 hover:text-cyan-400 transition-colors disabled:opacity-50"
                  title="Enhance prompt"
                >
                  <Wand2 size={20} className={isEnhancing ? 'animate-pulse' : ''} />
                </button>
              </div>
            )}
            
            {errors.content && (
              <p className="mt-1 text-sm text-red-400">{errors.content}</p>
            )}
            
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}