'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ControlPanel } from "@/components/carousel_page/control-panel";
import { PreviewPanel } from "@/components/carousel_page/preview-panel";
import { Camera, Palette, Sparkles, Brush, PenTool, Aperture, CheckCircle, AlertCircle, Edit3, Eye } from "lucide-react";
import { TemplateSelector } from '@/components/carousel_page/template-selector';
import { TemplateSaveDialog } from '@/components/carousel_page/template-save-dialog';
import { UserTemplate } from '@/lib/carousel-suggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button'; // For Undo button
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StyleSelector } from './style-selector';
import { AspectRatioGroup } from './aspect-ratio-group';
import { GenerationHistory } from './generation-history';


export type PromptMode = 'classic' | 'structured';

export interface CarouselFormState {
  mainPrompt: string;
  keyPoints: string[];
  styles: string[];
  audience: string;
  purpose: 'Educate' | 'Sell' | 'Inspire' | '';
  numberOfSlides: number;
  aspectRatio: '1:1' | '4:5' | '9:16';
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
  "Small business owners", "Freelancers", "Content creators", "Students",
  "Parents", "Entrepreneurs", "Marketing professionals", "Fitness enthusiasts",
];


type GenerationStage = 'form' | 'generating' | 'result' | 'error';
interface ProgressState { percent: number; message: string; currentSlide?: number };
interface Slide { imageUrl: string; caption: string; };

export function CarouselClientPage() {
  const [formState, setFormState] = useState<CarouselFormState>(INITIAL_STATE);
  const [promptMode, setPromptMode] = useState<PromptMode>('structured');
  
  // States for structured prompt
  const [mainTopic, setMainTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [purpose, setPurpose] = useState<CarouselFormState['purpose']>("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  
  // Generation & UI states
  const [generationStage, setGenerationStage] = useState<GenerationStage>('form');
  const [progress, setProgress] = useState<ProgressState>({ percent: 0, message: '' });
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{ slides: Slide[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carousel result states
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [carouselData, setCarouselData] = useState<any>(null);
  const [carouselId, setCarouselId] = useState<string | null>(null);

  // Dialog states
  const [isTemplateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [isTemplateSaveOpen, setTemplateSaveOpen] = useState(false);

  // Mobile tab state for switching between Input and Preview
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');

  // Draft management states
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  const draftRestored = useRef(false);

  // Undo management states
  const [lastClearedState, setLastClearedState] = useState<Partial<CarouselFormState> | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Autosave structured prompt fields with a timestamp
  useEffect(() => {
    if (promptMode !== 'structured') return;
    const draft = { mainTopic, audience, purpose, keyPoints, timestamp: Date.now() };
    // Only save if there's actual content
    if (mainTopic || audience || purpose || keyPoints.length > 0) {
      localStorage.setItem('carouselFormDraft', JSON.stringify(draft));
    }
  }, [promptMode, mainTopic, audience, purpose, keyPoints]);

  // On mount, check for draft
  useEffect(() => {
    if (promptMode !== 'structured' || draftRestored.current) return;
    
    const draftString = localStorage.getItem('carouselFormDraft');
    const dismissedTimestamp = localStorage.getItem('dismissedDraftTimestamp');

    if (draftString) {
      // Check if the draft is not empty and has not been dismissed
      const draft = JSON.parse(draftString);
      if (Object.values(draft).some(v => (Array.isArray(v) ? v.length > 0 : v))) {
        // If there's a dismissed timestamp, only show alert if draft is newer
        if (dismissedTimestamp) {
          const draftTimestamp = JSON.parse(draftString).timestamp || 0;
          if (draftTimestamp > Number(dismissedTimestamp)) {
            setShowDraftAlert(true);
          }
        } else {
          setShowDraftAlert(true);
        }
      }
    }
  }, [promptMode]);
  
  const handleRestoreDraft = () => {
    const draftString = localStorage.getItem('carouselFormDraft');
    if (draftString) {
      try {
        const { mainTopic: dMain, audience: dAud, purpose: dPur, keyPoints: dPts } = JSON.parse(draftString);
        setMainTopic(dMain || '');
        setAudience(dAud || '');
        setPurpose(dPur || '');
        setKeyPoints(Array.isArray(dPts) ? dPts : []);
        draftRestored.current = true;
      } catch {}
    }
    setShowDraftAlert(false);
  };

  const handleDismissDraft = () => {
    const draftString = localStorage.getItem('carouselFormDraft');
    if(draftString) {
        const draftTimestamp = JSON.parse(draftString).timestamp || Date.now();
        localStorage.setItem('dismissedDraftTimestamp', String(draftTimestamp));
    }
    // We don't remove the draft, just the alert for it.
    // The draft can be overwritten by new user input later.
    setShowDraftAlert(false);
  };

  const handleClearForm = () => {
    // Store current state for undo
    setLastClearedState({
      mainPrompt: promptMode === 'classic' ? formState.mainPrompt : mainTopic,
      audience: audience,
      purpose: purpose,
      keyPoints: keyPoints,
    });

    // Clear states
    setFormState(prev => ({...prev, mainPrompt: ''}));
    setMainTopic("");
    setAudience("");
    setPurpose("");
    setKeyPoints([]);
    
    // Show undo button and set timeout to hide it
    setShowUndo(true);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setLastClearedState(null);
    }, 5000);
  };

  const handleUndoClear = () => {
    if (lastClearedState) {
      if (promptMode === 'classic') {
        setFormState(prev => ({...prev, mainPrompt: lastClearedState.mainPrompt || ''}));
      } else {
        setMainTopic(lastClearedState.mainPrompt || '');
        setAudience(lastClearedState.audience || '');
        setPurpose(lastClearedState.purpose || '');
        setKeyPoints(lastClearedState.keyPoints || []);
      }
    }
    setShowUndo(false);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };


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
          
          // Update carousel states
          setCarouselImages(data.slides.map((slide: any) => slide.image_url || ''));
          setCarouselData(data);
          setCarouselId(generationId);
          
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
    if (promptMode === 'structured') {
        setMainTopic(template.mainTopic);
        setAudience(template.audience);
        setPurpose(template.purpose as CarouselFormState['purpose']);
        setKeyPoints(template.keyPoints);
    } else {
        setFormState(prev => ({
            ...prev,
            mainPrompt: `Create a carousel about "${template.mainTopic}" for ${template.audience}. The purpose is to ${template.purpose.toLowerCase()}. Key points: ${template.keyPoints.join(', ')}.`
        }));
    }
    setTemplateSelectorOpen(false);
  };

  const handleRestart = () => {
    handleClearForm(); // Use the new clear with undo logic
    setGenerationStage('form');
    setProgress({ percent: 0, message: '' });
    setGenerationId(null);
    setResultData(null);
    setError(null);
    
    // Clear carousel states
    setCarouselImages([]);
    setCarouselData(null);
    setCarouselId(null);
    
    localStorage.removeItem('carouselFormDraft');
    // Hide undo immediately on full restart
    setShowUndo(false); 
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  const handleGenerate = async () => {
    setGenerationStage('generating');
    setProgress({ percent: 0, message: 'Warming up the AI...' });
    setError(null);

    const { numberOfSlides, styles, aspectRatio } = formState;
    const finalFormState = { ...formState, numberOfSlides, styles, aspectRatio };


    let finalPrompt = '';

    if (promptMode === 'structured') {
      if (!mainTopic.trim() || !audience.trim() || !purpose.trim()) {
        setError("Please fill in Main Topic, Audience, and Purpose.");
        setGenerationStage('error');
        return;
      }
      finalPrompt = `Create a carousel with ${numberOfSlides} slides.
---
**Topic/Core Idea:** ${mainTopic}
**Target Audience:** ${audience}
**Main Purpose:** ${purpose}
**Key Points to Cover:** ${keyPoints.length > 0 ? keyPoints.join(', ') : 'None specified.'}
**Visual Style:** ${styles.join(', ')}
**Aspect Ratio:** ${aspectRatio}
---
Instructions: Based on the details above, generate a compelling and visually consistent carousel. Each slide should have a clear caption and an accompanying image that matches the specified visual style.`;
    } else { // classic mode
      if (!formState.mainPrompt.trim()) {
        setError("Please enter a prompt.");
        setGenerationStage('error');
        return;
      }
      finalPrompt = `Create a carousel with ${numberOfSlides} slides based on the following prompt.
---
**Prompt:** ${formState.mainPrompt}
**Visual Style:** ${styles.join(', ')}
**Aspect Ratio:** ${aspectRatio}
---
Instructions: Generate a compelling and visually consistent carousel based on the user's prompt. Ensure each slide has a caption and image.`;
    }

    try {
        const response = await fetch('/api/carousel/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: finalPrompt,
                imageCount: finalFormState.numberOfSlides,
                styles: finalFormState.styles
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
        formState={{ ...formState, mainPrompt: mainTopic, keyPoints, audience, purpose }}
      />
      
      {/* Draft Restore Alert */}
      <AnimatePresence>
        {showDraftAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-400/40 flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="font-bold text-amber-100">Welcome back!</p>
              <p className="text-sm text-amber-200">You have an unsaved draft. Would you like to continue editing?</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={handleRestoreDraft} className="px-3 py-1 text-xs font-semibold bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">Continue</button>
              <button onClick={handleDismissDraft} className="px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 rounded transition-colors">Dismiss</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Alert */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-3 rounded-lg bg-glass backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-4">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium text-gray-100">Form cleared.</span>
            <Button variant="ghost" className="text-sm text-blue-400 hover:text-blue-300 p-0 h-auto" onClick={handleUndoClear}>
              Undo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-natural text-gray-50 p-1 sm:p-2 lg:p-4">
        <div className="w-full max-w-screen-2xl mx-auto rounded-xl border border-white/10 bg-glass backdrop-blur-sm shadow-2xl shadow-blue-500/10">
          
          {/* Mobile Tab Navigation - Only visible on mobile/tablet */}
          <div className="lg:hidden border-b border-white/10 bg-glass">
            <RadioGroup 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'input' | 'preview')}
              className="flex w-full"
            >
              <div className="flex-1">
                <RadioGroupItem value="input" id="input-tab" className="peer sr-only" />
                <Label 
                  htmlFor="input-tab" 
                  className="flex items-center justify-center gap-2 p-4 cursor-pointer text-gray-200 peer-checked:text-gray-50 peer-checked:bg-white/10 border-r border-white/10 transition-all duration-200 hover:bg-white/5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="font-medium">Input</span>
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem value="preview" id="preview-tab" className="peer sr-only" />
                <Label 
                  htmlFor="preview-tab" 
                  className="flex items-center justify-center gap-2 p-4 cursor-pointer text-gray-200 peer-checked:text-gray-50 peer-checked:bg-white/10 transition-all duration-200 hover:bg-white/5"
                >
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">Preview</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(440px,460px)_1fr] xl:grid-cols-[minmax(460px,480px)_1fr] min-h-[600px]">
            {/* Input Panel - Left side (desktop only) */}
            <div className="w-full flex flex-col bg-glass border-r border-white/10 min-w-0">
              <ControlPanel
                formState={formState}
                setFormState={setFormState}
                onGenerate={handleGenerate}
                isGenerating={generationStage === 'generating'}
                onLoadTemplate={() => setTemplateSelectorOpen(true)}
                onSaveTemplate={() => setTemplateSaveOpen(true)}
                // Props for new system
                promptMode={promptMode}
                setPromptMode={setPromptMode}
                structuredState={{ mainTopic, setMainTopic, audience, setAudience, purpose, setPurpose, keyPoints, setKeyPoints }}
                onClear={handleClearForm}
              />
            </div>

            {/* Preview Panel - Right side (desktop only) */}
            <div className="flex-1 w-full p-4 md:p-6 bg-glass">
              <PreviewPanel
                numberOfSlides={formState.numberOfSlides}
                aspectRatio={formState.aspectRatio}
                carouselImages={carouselImages}
                isGenerating={generationStage === 'generating'}
                generationStage={generationStage}
                carouselData={carouselData}
                carouselId={carouselId}
              />
            </div>
          </div>

          {/* Mobile Tab Content */}
          <div className="lg:hidden min-h-[600px]">
            {activeTab === 'input' && (
              <div className="w-full bg-glass min-w-0">
                <ControlPanel
                  formState={formState}
                  setFormState={setFormState}
                  onGenerate={handleGenerate}
                  isGenerating={generationStage === 'generating'}
                  onLoadTemplate={() => setTemplateSelectorOpen(true)}
                  onSaveTemplate={() => setTemplateSaveOpen(true)}
                  // Props for new system
                  promptMode={promptMode}
                  setPromptMode={setPromptMode}
                  structuredState={{ mainTopic, setMainTopic, audience, setAudience, purpose, setPurpose, keyPoints, setKeyPoints }}
                  onClear={handleClearForm}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="w-full p-4 bg-glass">
                <PreviewPanel
                  numberOfSlides={formState.numberOfSlides}
                  aspectRatio={formState.aspectRatio}
                  carouselImages={carouselImages}
                  isGenerating={generationStage === 'generating'}
                  generationStage={generationStage}
                  carouselData={carouselData}
                  carouselId={carouselId}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
} 