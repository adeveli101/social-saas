'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Style {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface StyleSelectorProps {
  availableStyles: Style[];
  selectedStyles: string[];
  onStyleToggle: (styleId: string) => void;
}

export function StyleSelector({ availableStyles, selectedStyles, onStyleToggle }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Visual Style</Label>
      <div className="flex flex-wrap gap-3">
        {availableStyles.map((style) => {
          const isSelected = selectedStyles.includes(style.id);
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onStyleToggle(style.id)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isSelected
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              )}
            >
              {isSelected ? <Check className="h-4 w-4" /> : style.icon}
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 