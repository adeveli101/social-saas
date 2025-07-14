'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PromptInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PromptInputSection({ value, onChange, placeholder }: PromptInputSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="main-prompt">Main Idea</Label>
      <Textarea
        id="main-prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Describe your carousel in detail..."}
        className="h-32"
      />
    </div>
  );
} 