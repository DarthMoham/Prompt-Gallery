import React, { useEffect, useState } from 'react';
import { Plus, Search, Sparkles, Filter, Wand2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { PromptCard } from './components/PromptCard';
import { AddPromptModal } from './components/AddPromptModal';
import * as api from './lib/api';
import { Prompt } from './lib/api';

function toInitialCaps(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptToEnhance, setPromptToEnhance] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [prefilledContent, setPrefilledContent] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, []);

  async function fetchPrompts() {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await api.fetchPrompts();
      setPrompts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prompts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEnhancePrompt() {
    if (!promptToEnhance.trim()) {
      toast.error('Please enter a prompt to enhance');
      return;
    }

    try {
      setIsEnhancing(true);
      const enhanced = await api.enhancePrompt(promptToEnhance);
      setEnhancedPrompt(enhanced);
      toast.success('Prompt enhanced successfully!');
    } catch (err) {
      toast.error('Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  }

  async function addPrompt(promptData: { title: string; content: string; category: string }) {
    try {
      await api.addPrompt(promptData);
      toast.success('Prompt added successfully');
      await fetchPrompts();
      setPromptToEnhance('');
      setEnhancedPrompt('');
      setPrefilledContent('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add prompt';
      toast.error(errorMessage);
    }
  }

  async function editPrompt(id: string, promptData: { title: string; content: string; category: string }) {
    try {
      await api.updatePrompt(id, promptData);
      toast.success('Prompt updated successfully');
      await fetchPrompts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update prompt';
      toast.error(errorMessage);
    }
  }

  async function deletePrompt(id: string) {
    try {
      await api.deletePrompt(id);
      toast.success('Prompt deleted successfully');
      await fetchPrompts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete prompt';
      toast.error(errorMessage);
    }
  }

  const categories = ['all', ...new Set(prompts.map(prompt => prompt.category))].sort();

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      prompt.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCopyEnhanced = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast.success('Enhanced prompt copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSaveEnhanced = () => {
    setPrefilledContent(enhancedPrompt);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={fetchPrompts}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-400 sm:size-8 size-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Prompt Gallery</h1>
          </div>
          <button
            onClick={() => {
              setPrefilledContent('');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="sm:size-5" />
            <span className="hidden sm:inline">Add Prompt</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Enhanced Prompt Enhancement Section */}
        <div className="mb-12 bg-white/[0.07] backdrop-blur-lg rounded-xl p-6 border border-white/[0.07]">
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="text-cyan-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Enhance Your Prompt</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm font-medium">Original Prompt</label>
              </div>
              <textarea
                value={promptToEnhance}
                onChange={(e) => setPromptToEnhance(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 min-h-[180px] resize-none"
              />
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !promptToEnhance.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Wand2 size={18} className={isEnhancing ? 'animate-pulse' : ''} />
                {isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-white/80 text-sm font-medium">Enhanced Version</label>
              </div>
              <div className={`relative ${!enhancedPrompt ? 'min-h-[180px]' : ''}`}>
                {enhancedPrompt ? (
                  <textarea
                    value={enhancedPrompt}
                    readOnly
                    className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 min-h-[180px] resize-none"
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                    <div className="text-center px-6">
                      <Wand2 size={32} className="text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Your enhanced prompt will appear here</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyEnhanced}
                  disabled={!enhancedPrompt}
                  className="flex-1 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={handleSaveEnhanced}
                  disabled={!enhancedPrompt}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/20 disabled:text-white/20 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Save to Gallery
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.07] border border-white/[0.07] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.09] transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <div className="relative inline-block w-full sm:w-[240px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-white/[0.07] border border-white/[0.07] rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.09] cursor-pointer transition-colors"
              >
                {categories.map(category => (
                  <option 
                    key={category} 
                    value={category}
                    className="bg-[#0F1729] text-white"
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="fill-current h-4 w-4 text-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.length === 0 ? (
              <div className="col-span-full text-center text-white/60 py-12">
                {searchTerm || selectedCategory !== 'all' ? 'No prompts found matching your criteria.' : 'No prompts added yet.'}
              </div>
            ) : (
              filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onDelete={deletePrompt}
                  onEdit={editPrompt}
                  onCategoryClick={handleCategoryClick}
                />
              ))
            )}
          </div>
        )}

        <AddPromptModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setPrefilledContent('');
          }}
          onAdd={addPrompt}
          prefilledContent={prefilledContent}
        />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;