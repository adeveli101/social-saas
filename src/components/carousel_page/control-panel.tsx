'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PromptInputSection } from './prompt-input-section';
import { StyleSelector } from './style-selector';
import { CarouselFormState, PromptMode } from './carousel-client';
import { PromptModeSwitcher } from './PromptModeSwitcher';
import { StructuredPromptForm } from './StructuredPromptForm';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AspectRatioGroup } from './aspect-ratio-group';
import { Book, Save, RotateCcw, Loader2, Sparkles } from 'lucide-react';

type StyleOption = { 
  id: string; 
  label: string; 
  icon: React.ReactNode; 
};

interface ControlPanelProps {
  formState: CarouselFormState;
  setFormState: React.Dispatch<React.SetStateAction<CarouselFormState>>;
  onGenerate: () => void;
  isGenerating: boolean;
  availableStyles: StyleOption[];
  audienceOptions: string[];
  onLoadTemplate: () => void;
  onSaveTemplate: () => void;
  // New props
  promptMode: PromptMode;
  setPromptMode: (mode: PromptMode) => void;
  structuredState: {
    mainTopic: string;
    setMainTopic: (value: string) => void;
    audience: string;
    setAudience: (value: string) => void;
    purpose: CarouselFormState['purpose'];
    setPurpose: (value: CarouselFormState['purpose']) => void;
    keyPoints: string[];
    setKeyPoints: (value: string[]) => void;
  };
  onClear: () => void;
}

export function ControlPanel({
  formState,
  setFormState,
  onGenerate,
  isGenerating,
  availableStyles,
  onLoadTemplate,
  onSaveTemplate,
  promptMode,
  setPromptMode,
  structuredState,
  onClear,
}: ControlPanelProps) {
  return (
    <div className="h-fit flex flex-col bg-glass backdrop-blur-sm border-white/10">
      {/* Main Content - No scroll needed */}
      <div className="p-3 sm:p-4 space-y-4">
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-50">AI Content Generator</h2>
          <p className="text-xs text-gray-200">Craft your next viral post.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLoadTemplate} 
              disabled={isGenerating} 
              className="bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
            >
                <Book className="h-4 w-4 mr-2" />
                Load
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={onSaveTemplate} 
                disabled={isGenerating || promptMode === 'classic'}
                className="bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
                <Save className="h-4 w-4 mr-2" />
                Save
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClear} 
                disabled={isGenerating}
                className="text-gray-300 hover:bg-white/10 hover:text-white"
            >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
            </Button>
        </div>
        
        <Separator className="bg-white/20" />
        
        <PromptModeSwitcher promptMode={promptMode} setPromptMode={setPromptMode} />
        
        {promptMode === 'classic' ? (
          <PromptInputSection formState={formState} setFormState={setFormState} />
        ) : (
          <StructuredPromptForm structuredState={structuredState} />
        )}

        <Separator className="bg-white/20" />
        
        <StyleSelector
          selectedStyle={formState.styles[0] || ''}
          onStyleSelect={(style) => setFormState(prev => ({ ...prev, styles: [style] }))}
        />

        <Separator className="bg-white/20" />

      </div>
      
      {/* Footer - Generate button */}
      <div className="p-3 bg-glass border-t border-white/10">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2.5 text-base hover:shadow-lg transition-all duration-300"
        >
          {isGenerating ? 
            ( <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</> ) : 
            ( <><Sparkles className="mr-2 h-5 w-5" /> Generate</> )
          }
        </Button>
      </div>
    </div>
  );
} 