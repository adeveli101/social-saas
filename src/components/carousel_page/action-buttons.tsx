'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, FolderOpen, RefreshCw, Save } from 'lucide-react';

interface ActionButtonsProps {
  isGenerating: boolean;
  onGenerate: () => void;
  onLoadTemplate: () => void;
  onSaveTemplate: () => void;
  onReset: () => void;
  isGenerateDisabled: boolean;
}

export function ActionButtons({
  isGenerating,
  onGenerate,
  onLoadTemplate,
  onSaveTemplate,
  onReset,
  isGenerateDisabled,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-md h-12"
        onClick={onGenerate}
        disabled={isGenerating || isGenerateDisabled}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Carousel
          </>
        )}
      </Button>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          className="w-full rounded-lg border-zinc-700 hover:bg-zinc-800"
          onClick={onLoadTemplate}
          disabled={isGenerating}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Load
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-lg border-zinc-700 hover:bg-zinc-800"
          onClick={onSaveTemplate}
          disabled={isGenerating}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button
          variant="ghost"
          className="w-full rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          onClick={onReset}
          disabled={isGenerating}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
} 