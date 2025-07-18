// src/components/carousel_page/StructuredPromptForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { TOPIC_SUGGESTIONS, AUDIENCE_SUGGESTIONS, CONTEXTUAL_SUGGESTIONS } from '@/lib/prompt-suggestions';
import { KeyPointsInput } from './key-points-input'; // We'll reuse this
import { CarouselFormState } from './carousel-client';

interface StructuredPromptFormProps {
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
}

const AnimatedChip = ({ label, onClick, isSelected }: { label: string, onClick: () => void, isSelected: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:scale-105
        ${isSelected
          ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
          : 'bg-white/10 text-gray-200 border border-white/20 hover:bg-white/15 hover:text-white'
        }`
      }
    >
      {label}
    </button>
);

export function StructuredPromptForm({ structuredState }: StructuredPromptFormProps) {
  const { mainTopic, setMainTopic, audience, setAudience, purpose, setPurpose, keyPoints, setKeyPoints } = structuredState;

  const [dynamicAudienceSuggestions, setDynamicAudienceSuggestions] = useState(AUDIENCE_SUGGESTIONS);
  
  useEffect(() => {
    if (CONTEXTUAL_SUGGESTIONS[mainTopic]) {
      setDynamicAudienceSuggestions(CONTEXTUAL_SUGGESTIONS[mainTopic].audience);
    } else {
      setDynamicAudienceSuggestions(AUDIENCE_SUGGESTIONS);
    }
  }, [mainTopic]);

  const inputClasses = "min-w-0 w-full bg-white/5 border-white/20 text-gray-100 placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/30";
  const selectTriggerClasses = `${inputClasses} text-left`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Main Topic */}
      <div className="space-y-3">
        <Label htmlFor="mainTopic" className="font-semibold text-gray-50">Main Topic</Label>
        <Input
          id="mainTopic"
          placeholder="e.g., The future of AI"
          value={mainTopic}
          onChange={(e) => setMainTopic(e.target.value)}
          className={inputClasses}
        />
        <div className="flex flex-wrap gap-2">
          {TOPIC_SUGGESTIONS.map(topic => (
            <AnimatedChip
              key={topic}
              label={topic}
              isSelected={mainTopic === topic}
              onClick={() => setMainTopic(topic)}
            />
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <Label htmlFor="audience" className="font-semibold text-gray-50">Target Audience</Label>
        <Input
          id="audience"
          placeholder="e.g., Tech Entrepreneurs"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className={inputClasses}
        />
        <div className="flex flex-wrap gap-2">
          {dynamicAudienceSuggestions.map(aud => (
            <AnimatedChip
              key={aud}
              label={aud}
              isSelected={audience === aud}
              onClick={() => setAudience(aud)}
            />
          ))}
        </div>
      </div>
      
      {/* Purpose */}
      <div className="space-y-3">
        <Label htmlFor="purpose" className="font-semibold text-gray-50">Purpose</Label>
        <Select value={purpose} onValueChange={(value) => setPurpose(value as CarouselFormState['purpose'])}>
          <SelectTrigger className={selectTriggerClasses}>
            <SelectValue placeholder="Select the main goal..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Educate">Educate</SelectItem>
            <SelectItem value="Sell">Sell</SelectItem>
            <SelectItem value="Inspire">Inspire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr className="border-white/20" />
      
      {/* Key Points */}
      <KeyPointsInput 
        tags={keyPoints} 
        onTagsChange={setKeyPoints} 
      />

    </div>
  );
} 