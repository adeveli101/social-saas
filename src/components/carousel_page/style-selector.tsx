'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Style {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
}

const styles = [
    { id: 'photo-realistic', name: 'Photo-realistic' },
    { id: 'minimalist-vector', name: 'Minimalist Vector' },
    { id: '3d-characters', name: '3D Characters' },
    { id: 'artistic', name: 'Artistic' },
    { id: 'sketch', name: 'Sketch' },
    { id: 'cinematic', name: 'Cinematic' },
]

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  const handleStyleClick = (styleId: string) => {
    // If clicking the same style, deselect it
    if (selectedStyle === styleId) {
      onStyleSelect('');
    } else {
      onStyleSelect(styleId);
    }
  };

  return (
    <div>
      <Label className="mb-2 block text-gray-200">Visual Style</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {styles.map((style) => (
          <Button
            key={style.id}
            type="button"
            onClick={() => handleStyleClick(style.id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs lg:text-sm font-medium transition-all whitespace-nowrap",
              selectedStyle === style.id
                ? "bg-blue-500/30 text-blue-200 border border-blue-400/50 shadow-md"
                : "bg-white/10 text-gray-200 border border-white/20 hover:bg-white/15 hover:text-white"
            )}
          >
            {style.name}
          </Button>
        ))}
      </div>
    </div>
  );
} 