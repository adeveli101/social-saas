'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';

interface KeyPointsInputProps {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
}

export function KeyPointsInput({ tags, onTagsChange }: KeyPointsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="key-points" className="text-gray-200">Key Points / Tags</Label>
      <Input
        id="key-points"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter..."
        className="bg-white/5 border-white/20 text-gray-100 placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/30 min-w-0 w-full"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 1.2 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center bg-white/10 text-gray-200 border border-white/20 rounded-md px-2 py-1 text-sm font-medium hover:bg-white/15"
            >
              <span>{tag}</span>
              <button
                type="button"
                className="ml-2 text-gray-300 hover:text-white"
                onClick={() => removeTag(tag)}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 