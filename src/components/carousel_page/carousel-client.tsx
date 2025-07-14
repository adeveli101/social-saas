'use client';

import React, { useState, useEffect } from 'react';
import { ControlPanel } from "@/components/carousel_page/control-panel";
import { PreviewPanel } from "@/components/carousel_page/preview-panel";
import { Camera, Palette, Sparkles, Brush, PenTool, Aperture } from "lucide-react";
import { TemplateSelector } from '@/components/carousel_page/template-selector';
import { TemplateSaveDialog } from '@/components/carousel_page/template-save-dialog';
import { UserTemplate } from '@/lib/carousel-suggestions';

export interface CarouselFormState {
  mainPrompt: string;
  keyPoints: string[];
  styles: string[];
  audience: string;
  purpose: 'Educate' | 'Sell' | 'Inspire' | '';
  numberOfSlides: number;
  aspectRatio: '1:1' | '4:5';
}

export const INITIAL_STATE: CarouselFormState = {
  mainPrompt: '',
  keyPoints: [],
  styles: ["photo"],
  audience: 'Small business owners',
  purpose: 'Educate',
  numberOfSlides: 5,
  aspectRatio: '1:1',
};

const AVAILABLE_STYLES = [
  { id: "photo", label: "Photo-realistic", icon: <Camera className="h-4 w-4" /> },
  { id: "vector", label: "Minimalist Vector", icon: <Palette className="h-4 w-4" /> },
  { id: "3d", label: "3D Characters", icon: <Sparkles className="h-4 w-4" /> },
  { id: "artistic", label: "Artistic", icon: <Brush className="h-4 w-4" /> },
  { id: "sketch", label: "Sketch", icon: <PenTool className="h-4 w-4" /> },
  { id: "cinematic", label: "Cinematic", icon: <Aperture className="h-4 w-4" /> },
];

const AUDIENCE_OPTIONS = [
  "Small business owners",
  "Freelancers",
  "Content creators",
  "Students",
  "Parents",
  "Entrepreneurs",
  "Marketing professionals",
  "Fitness enthusiasts",
];

type GenerationStage = 'form' | 'generating' | 'result' | 'error';
interface ProgressState { percent: number; message: string; currentSlide?: number };
interface Slide { imageUrl: string; caption: string; };

export function CarouselClientPage() {
  const [formState, setFormState] = useState<CarouselFormState>(INITIAL_STATE);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('form');
  const [progress, setProgress] = useState<ProgressState>({ percent: 0, message: '' });
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{ slides: Slide[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTemplateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [isTemplateSaveOpen, setTemplateSaveOpen] = useState(false);

  // Polling effect
  useEffect(() => {
    if (generationStage !== 'generating' || !generationId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/carousel/${generationId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch generation status.');
        }
        const data = await response.json();

        setProgress({
          percent: data.progress || 0,
          message: data.status || 'Generating...',
          currentSlide: data.current_slide_index,
        });

        if (data.progress === 100 && data.slides.length > 0) {
          setGenerationStage('result');
          setResultData({ slides: data.slides });
          clearInterval(interval);
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setGenerationStage('error');
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [generationStage, generationId]);


  const handleTemplateSelect = (template: UserTemplate) => {
    setFormState(prev => ({
      ...prev,
      mainPrompt: `Create a carousel about "${template.mainTopic}" for ${template.audience}. The main purpose is to ${template.purpose.toLowerCase()}.`,
      keyPoints: template.keyPoints,
      audience: template.audience,
      purpose: template.purpose as CarouselFormState['purpose'],
    }));
    setTemplateSelectorOpen(false);
  };

  const handleRestart = () => {
    setFormState(INITIAL_STATE);
    setGenerationStage('form');
    setProgress({ percent: 0, message: '' });
    setGenerationId(null);
    setResultData(null);
    setError(null);
  };

  const handleGenerate = async () => {
    setGenerationStage('generating');
    setProgress({ percent: 0, message: 'Starting...' });
    setError(null);

    const { mainPrompt, numberOfSlides, styles, keyPoints, audience, purpose, aspectRatio } = formState;

    // Construct the prompt for the backend
    const finalPrompt = `Create a carousel with ${numberOfSlides} slides.
Topic: ${mainPrompt}
Target Audience: ${audience}
Purpose: ${purpose}
Key Points: ${keyPoints.join(', ')}
Visual Style: ${styles.join(', ')}
Aspect Ratio: ${aspectRatio}`;

    try {
        const response = await fetch('/api/carousel/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: finalPrompt,
                imageCount: numberOfSlides,
                styles: styles
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Carousel generation failed.');
        }

        const data = await response.json();
        setGenerationId(data.id);
        
    } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setGenerationStage('error');
    }
  };

  return (
    <>
      <TemplateSelector
        open={isTemplateSelectorOpen}
        onOpenChange={setTemplateSelectorOpen}
        onTemplateSelect={handleTemplateSelect}
      />
      <TemplateSaveDialog
        isOpen={isTemplateSaveOpen}
        onOpenChange={setTemplateSaveOpen}
        formState={formState}
      />
      <div className="min-h-screen bg-black text-white flex justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-screen-2xl flex flex-col lg:flex-row rounded-xl border border-zinc-800 overflow-hidden shadow-2xl shadow-blue-500/10">
          {/* Left Column: Control Panel */}
          <div className="w-full lg:w-[450px] lg:flex-shrink-0 lg:h-full lg:overflow-y-auto bg-zinc-900/50 border-r border-zinc-800">
            <ControlPanel
              formState={formState}
              setFormState={setFormState}
              onGenerate={handleGenerate}
              isGenerating={generationStage === 'generating'}
              availableStyles={AVAILABLE_STYLES}
              audienceOptions={AUDIENCE_OPTIONS}
              onLoadTemplate={() => setTemplateSelectorOpen(true)}
              onSaveTemplate={() => setTemplateSaveOpen(true)}
            />
          </div>

          {/* Right Column: Preview Panel */}
          <div className="flex-1 w-full lg:h-full lg:overflow-y-auto p-4 md:p-6 lg:p-8">
            <PreviewPanel
              numberOfSlides={formState.numberOfSlides}
              stage={generationStage}
              aspectRatio={formState.aspectRatio}
              progress={progress}
              result={resultData}
              onRestart={handleRestart}
            />
            {generationStage === 'error' && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
                        <h3 className="font-bold">Error</h3>
                        <p>{error}</p>
                        <button onClick={handleRestart}>Try Again</button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 