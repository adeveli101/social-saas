'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sparkles, Download, RefreshCw, Wand2, RectangleVertical, Square, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AspectRatioGroup } from './aspect-ratio-group';
import { SlideCountSelector } from './slide-count-selector';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// --- TYPE DEFINITIONS ---
type GenerationStage = 'form' | 'generating' | 'result' | 'error';

interface Slide {
  imageUrl: string;
  caption: string;
}

interface PreviewPanelProps {
  numberOfSlides: number;
  aspectRatio: '1:1' | '4:5' | '9:16';
  carouselImages: string[];
  isGenerating: boolean;
  generationStage: GenerationStage;
  carouselData: { slides: Slide[] } | null;
  carouselId: string | null;
  progress?: { percent: number; message: string; currentSlide?: number };
  onAspectRatioChange?: (ratio: '1:1' | '4:5' | '9:16') => void;
  onSlideCountChange?: (count: number) => void;
}

// --- UI COMPONENTS ---

const LoadingOverlay = ({ progress }: { progress?: PreviewPanelProps['progress'] }) => (
  <div className="absolute inset-0 bg-glass backdrop-blur-sm flex flex-col items-center justify-center z-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="p-4 bg-glass rounded-full border border-white/20 inline-block mb-6"
    >
      <Sparkles className="h-10 w-10 text-blue-400" />
    </motion.div>
    <h3 className="text-xl font-bold text-gray-50">AI is creating your masterpiece...</h3>
    {progress && (
       <div className="w-full max-w-sm mx-auto space-y-2 mt-4">
        <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div className="bg-primary h-2 rounded-full" initial={{ width: '0%' }} animate={{ width: `${progress.percent}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}/>
        </div>
        <p className="text-sm text-center text-[var(--muted-foreground)]">{progress.message}</p>
      </div>
    )}
  </div>
);


const SlideCard = ({ slide, aspectRatio }: { slide?: Slide, aspectRatio: string }) => (
    <Card className="h-full w-full bg-transparent border-none shadow-none">
        <CardContent className={cn("relative flex items-center justify-center h-full w-full p-0 overflow-hidden rounded-lg shadow-lg", 
            aspectRatio === '1:1' ? 'aspect-square' : 
            aspectRatio === '4:5' ? 'aspect-[4/5]' :
            'aspect-[9/16]'
        )}>
            {slide ? (
                <Image src={slide.imageUrl} alt="Generated slide" fill className="object-cover" />
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-glass/80 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-lg">
                    <Wand2 className="h-16 w-16 text-gray-400/60" />
                </div>
            )}
        </CardContent>
    </Card>
);

// --- COMPACT FORMAT & SLIDE COUNT SELECTOR ---
const CompactFormatSelector = ({ 
  aspectRatio, 
  numberOfSlides, 
  onAspectRatioChange, 
  onSlideCountChange 
}: { 
  aspectRatio: '1:1' | '4:5' | '9:16';
  numberOfSlides: number;
  onAspectRatioChange?: (ratio: '1:1' | '4:5' | '9:16') => void;
  onSlideCountChange?: (count: number) => void;
}) => {
  const ratioOptions = [
    { value: '4:5', label: '4:5', icon: RectangleVertical, name: 'Carousel' },
    { value: '1:1', label: '1:1', icon: Square, name: 'Square' },
    { value: '9:16', label: '9:16', icon: Smartphone, name: 'Reels' },
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      {/* Format Selection Group */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-medium text-white">Format:</span>
          <div className="flex gap-2">
            {ratioOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAspectRatioChange?.(option.value as '1:1' | '4:5' | '9:16')}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-md border transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900",
                  aspectRatio === option.value 
                    ? "border-blue-500 bg-blue-600/30 text-white shadow-lg" 
                    : "border-white/30 text-white hover:border-white/50 hover:bg-white/15"
                )}
              >
                <option.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{option.label}</span>
                {aspectRatio === option.value && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full ml-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Count Selection Group */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-white">Slides:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSlideCountChange?.(Math.max(2, numberOfSlides - 1))}
              disabled={numberOfSlides <= 2}
              className="w-10 h-10 rounded-md border border-white/30 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              -
            </button>
            <span className="w-12 text-center text-lg font-bold text-blue-300">{numberOfSlides}</span>
            <button
              onClick={() => onSlideCountChange?.(Math.min(10, numberOfSlides + 1))}
              disabled={numberOfSlides >= 10}
              className="w-10 h-10 rounded-md border border-white/30 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PREVIEW PANEL ---

export function PreviewPanel({ numberOfSlides, aspectRatio, carouselImages, isGenerating, generationStage, carouselData, carouselId, progress, onAspectRatioChange, onSlideCountChange }: PreviewPanelProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const slides = carouselData?.slides ?? [];
  const hasResult = generationStage === 'result' && slides.length > 0;
  
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
      setSelectedIndex(api.selectedScrollSnap());
      setIsCaptionExpanded(false); // Reset on slide change
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);
    
    // Initial setup
    onSelect();

     return () => {
        api.off("select", onSelect);
        api.off("reInit", onSelect);
     }
  }, [api]);
  
  const totalSlides = count || numberOfSlides;
  const currentCaption = hasResult && slides[selectedIndex] ? slides[selectedIndex].caption : "Your generated caption will be displayed here once the content is created.";
  
  return (
    <div className="w-full flex flex-col p-4 bg-glass rounded-lg border border-white/10 relative">
      {isGenerating && <LoadingOverlay />}

      {/* Header */}
      <div className="w-full flex-shrink-0 flex items-center justify-between gap-3 p-2 bg-glass rounded-lg border border-white/20 min-h-[60px] z-10">
        {hasResult ? (
          <>
            <h4 className="font-bold text-lg text-white">Your Carousel</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/15 hover:text-white focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"> 
                <Download className="h-4 w-4 mr-2" /> Download All 
              </Button>
            </div>
          </>
        ) : (
           <div className="flex flex-col items-center text-center w-full">
             <h4 className="font-bold text-lg text-white">Content Preview</h4>
             <p className="text-sm text-gray-100">Your generated slides will appear here.</p>
           </div>
        )}
      </div>

      {/* Compact Format & Slide Count Selector */}
      {(onAspectRatioChange || onSlideCountChange) && (
        <div className="w-full mt-3">
          <CompactFormatSelector 
            aspectRatio={aspectRatio}
            numberOfSlides={numberOfSlides}
            onAspectRatioChange={onAspectRatioChange}
            onSlideCountChange={onSlideCountChange}
          />
        </div>
      )}

      {/* Main Carousel Area */}
       <div className="w-full flex flex-col items-center justify-start py-6">
            <div className="w-full max-w-md lg:max-w-lg">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {(hasResult ? slides : Array(numberOfSlides).fill(undefined)).map((slide: Slide | undefined, index: number) => (
                        <CarouselItem key={hasResult ? `result-${index}` : `skeleton-${index}`}>
                            <SlideCard 
                                slide={hasResult ? (slide as Slide) : undefined} 
                                aspectRatio={aspectRatio}
                            />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            
            {/* Caption Area */}
             <div className="w-full max-w-md lg:max-w-lg px-2 mt-3 text-sm">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={selectedIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn("text-white", !isCaptionExpanded && "line-clamp-2")}
                    >
                         {currentCaption}
                    </motion.p>
                </AnimatePresence>
                 {hasResult && currentCaption.length > 100 && ( // Rough estimate for line clamping
                     <Button
                         variant="link"
                         className="text-xs text-blue-300 hover:text-blue-200 p-0 h-auto mt-1 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                         onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                     >
                         {isCaptionExpanded ? '...less' : 'more...'}
                     </Button>
                 )}
            </div>

            {/* Standalone Navigation Controls */}
            <div className="flex items-center justify-center gap-2 rounded-full bg-glass/90 backdrop-blur-sm border border-white/30 p-2 shadow-lg mt-6">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/15 hover:text-white disabled:opacity-50 disabled:text-gray-500 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900" onClick={() => api?.scrollPrev()} disabled={!api?.canScrollPrev()}>
                    <span className="sr-only">Previous slide</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalSlides }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900",
                                i === selectedIndex 
                                    ? "bg-white" 
                                    : "bg-white/40 hover:bg-white/60"
                            )}
                        >
                            <span className="sr-only">Go to slide {i + 1}</span>
                        </button>
                    ))}
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/15 hover:text-white disabled:opacity-50 disabled:text-gray-500 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900" onClick={() => api?.scrollNext()} disabled={!api?.canScrollNext()}>
                    <span className="sr-only">Next slide</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
      </div>
    </div>
  );
} 