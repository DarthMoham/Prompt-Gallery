import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Tag } from 'lucide-react';

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
  error?: string;
}

export function CategoryCombobox({ value, onChange, categories, placeholder = "Category", error }: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const filteredCategories = categories.filter(
    cat => cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
  };

  const handleCategorySelect = (category: string) => {
    onChange(category);
    setSearchTerm(category);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={comboboxRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          <Tag size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-white/40 focus:outline-none ${error ? 'focus:border-red-500' : 'focus:border-cyan-500'}`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 p-1"
        >
          <ChevronDown size={18} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div className="py-1">
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-2.5 text-white hover:bg-white/10 transition-colors flex items-center gap-2 ${
                      category.toLowerCase() === value.toLowerCase() ? 'bg-white/5' : ''
                    }`}
                  >
                    <Tag size={16} className="text-white/40" />
                    {category}
                  </button>
                ))}
              </div>
            ) : searchTerm.trim() !== '' ? (
              <button
                type="button"
                onClick={() => handleCategorySelect(searchTerm)}
                className="w-full text-left px-4 py-2.5 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Plus size={16} className="text-cyan-400" />
                Create "{searchTerm}"
              </button>
            ) : (
              <div className="px-4 py-2.5 text-white/40 text-center">No categories found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}