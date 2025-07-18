'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, Save, RotateCcw } from "lucide-react";
import { PromptMode } from "./carousel-client";

interface ActionButtonsProps {
  onLoadTemplate: () => void;
  onSaveTemplate: () => void;
  onClear: () => void;
  isGenerating: boolean;
  promptMode: PromptMode;
}

export function ActionButtons({
  onLoadTemplate,
  onSaveTemplate,
  onClear,
  isGenerating,
  promptMode,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLoadTemplate} 
          disabled={isGenerating} 
          className="bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
        >
            <Book className="h-4 w-4 mr-2" />
            Load Template
        </Button>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveTemplate} 
            disabled={isGenerating || promptMode === 'classic'}
            className="bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
            <Save className="h-4 w-4 mr-2" />
            Save Template
        </Button>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear} 
            disabled={isGenerating}
            className="col-span-2 text-gray-300 hover:bg-white/10 hover:text-white"
        >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All Fields
        </Button>
      </div>
  );
} 