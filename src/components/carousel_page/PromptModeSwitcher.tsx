// src/components/carousel_page/PromptModeSwitcher.tsx
import React from 'react';
import type { PromptMode } from './carousel-client';

interface PromptModeSwitcherProps {
  promptMode: PromptMode;
  setPromptMode: (mode: PromptMode) => void;
}

export function PromptModeSwitcher({ promptMode, setPromptMode }: PromptModeSwitcherProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-[var(--card)] p-1 shadow-sm border border-[var(--border)]">
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${promptMode === 'structured'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg'
                : 'bg-transparent text-[var(--card-foreground)] hover:bg-[var(--muted)]'}
            `}
            onClick={() => setPromptMode('structured')}
            aria-pressed={promptMode === 'structured'}
          >
            Structured
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${promptMode === 'classic'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg'
                : 'bg-transparent text-[var(--card-foreground)] hover:bg-[var(--muted)]'}
            `}
            onClick={() => setPromptMode('classic')}
            aria-pressed={promptMode === 'classic'}
          >
            Classic
          </button>
        </div>
      </div>
      <div className="text-xs text-[var(--muted-foreground)] mt-2 text-center px-4">
        {promptMode === 'structured'
          ? 'Use guided fields for a perfect, detailed prompt.'
          : 'Write your prompt freely in a single text box.'}
      </div>
    </div>
  );
} 