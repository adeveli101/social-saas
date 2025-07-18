'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CarouselFormState } from './carousel-client';
import { CLASSIC_PROMPT_TEMPLATES } from '@/lib/prompt-suggestions';

interface PromptInputSectionProps {
  formState: CarouselFormState;
  setFormState: React.Dispatch<React.SetStateAction<CarouselFormState>>;
}

export function PromptInputSection({ formState, setFormState }: PromptInputSectionProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Label htmlFor="mainPrompt" className="font-semibold text-gray-50">Your Prompt</Label>
        <Textarea
          id="mainPrompt"
          placeholder="e.g., A 5-part series on the benefits of mindfulness meditation for busy professionals."
          value={formState.mainPrompt}
          onChange={(e) => setFormState(prev => ({ ...prev, mainPrompt: e.target.value }))}
          className="min-h-[150px] min-w-0 w-full bg-white/5 border-white/20 text-gray-100 placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/30"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-200">Or start with a template:</Label>
        <div className="flex flex-wrap gap-2">
          {CLASSIC_PROMPT_TEMPLATES.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => setFormState(prev => ({ ...prev, mainPrompt: template.example }))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:scale-105
                ${formState.mainPrompt === template.example
                  ? 'bg-blue-500/30 text-blue-200 border-blue-400/50'
                  : 'bg-white/10 text-gray-200 border border-white/20 hover:bg-white/15 hover:text-white'
                }`
              }
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 