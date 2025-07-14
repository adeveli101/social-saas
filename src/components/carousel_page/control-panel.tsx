'use client';

import React from 'react';
import { ActionButtons } from './action-buttons';
import { AdvancedSettings } from './advanced-settings';
import { KeyPointsInput } from './key-points-input';
import { PromptInputSection } from './prompt-input-section';
import { StyleSelector } from './style-selector';
import { CarouselFormState, INITIAL_STATE } from './carousel-client';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Style {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ControlPanelProps {
  formState: CarouselFormState;
  setFormState: React.Dispatch<React.SetStateAction<CarouselFormState>>;
  onGenerate: () => void;
  isGenerating: boolean;
  availableStyles: Style[];
  audienceOptions: string[];
  onLoadTemplate: () => void;
}

export function ControlPanel({ 
  formState, 
  setFormState, 
  onGenerate, 
  isGenerating,
  availableStyles,
  audienceOptions,
  onLoadTemplate,
}: ControlPanelProps) {
  
  const handleReset = () => {
    setFormState(INITIAL_STATE);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold tracking-tight px-2">Carousel Generator</h1>
        
        {/* Main Prompt Card */}
        <div className="bg-zinc-800/50 rounded-xl p-4 space-y-4">
          <PromptInputSection
            value={formState.mainPrompt}
            onChange={(value) => setFormState(prev => ({ ...prev, mainPrompt: value }))}
          />
          <ActionButtons
            isGenerating={isGenerating}
            onGenerate={onGenerate}
            onLoadTemplate={onLoadTemplate}
            onReset={handleReset}
            isGenerateDisabled={!formState.mainPrompt.trim()}
          />
        </div>

        {/* Style Selector Card */}
        <div className="bg-zinc-800/50 rounded-xl p-4 space-y-3">
          <StyleSelector
            availableStyles={availableStyles}
            selectedStyles={formState.styles}
            onStyleToggle={(styleId) => 
              setFormState(prev => ({
                ...prev,
                styles: prev.styles.includes(styleId)
                  ? prev.styles.filter(s => s !== styleId)
                  : [...prev.styles, styleId]
              }))
            }
          />
        </div>

        {/* KeyPoints and Advanced Settings Card */}
        <div className="bg-zinc-800/50 rounded-xl">
          <KeyPointsInput
            tags={formState.keyPoints}
            onTagsChange={(tags) => setFormState(prev => ({ ...prev, keyPoints: tags }))}
          />
          <AdvancedSettings>
            <div className="space-y-4">
              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={formState.audience}
                  onValueChange={(value) => setFormState(prev => ({...prev, audience: value}))}
                >
                  <SelectTrigger id="audience">
                    <SelectValue placeholder="Select audience..." />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Purpose */}
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                   value={formState.purpose}
                   onValueChange={(value: CarouselFormState['purpose']) => setFormState(prev => ({...prev, purpose: value}))}
                >
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Educate">Educate</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                    <SelectItem value="Inspire">Inspire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Number of Slides */}
              <div className="space-y-2">
                  <Label htmlFor="imageCount">Number of Slides: <span className="font-bold text-primary">{formState.numberOfSlides}</span></Label>
                  <input
                    id="imageCount"
                    type="range"
                    min={2}
                    max={10}
                    value={formState.numberOfSlides}
                    onChange={e => setFormState(prev => ({...prev, numberOfSlides: Number(e.target.value)}))}
                    className="w-full accent-primary"
                  />
              </div>
              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <RadioGroup
                  value={formState.aspectRatio}
                  onValueChange={(value: CarouselFormState['aspectRatio']) => setFormState(prev => ({ ...prev, aspectRatio: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1:1" id="r1" />
                    <Label htmlFor="r1">Square (1:1)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4:5" id="r2" />
                    <Label htmlFor="r2">Portrait (4:5)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </AdvancedSettings>
        </div>
      </div>
    </div>
  );
} 