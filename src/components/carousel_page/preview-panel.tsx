'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sparkles, Download, RefreshCw, Wand2 } from 'lucide-react';
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

// --- TYPE DEFINITIONS ---
type GenerationStage = 'form' | 'generating' | 'result';

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
  carouselData: any;
  carouselId: string | null;
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
        <CardContent className={cn("relative flex items-center justify-center h-full w-full p-0 overflow-hidden rounded-lg", 
            aspectRatio === '1:1' ? 'aspect-square' : 
            aspectRatio === '4:5' ? 'aspect-[4/5]' :
            'aspect-[9/16]'
        )}>
            {slide ? (
                <img src={slide.imageUrl} alt="Generated slide" className="h-full w-full object-cover" />
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-glass border-2 border-dashed border-white/20 rounded-lg">
                    <Wand2 className="h-12 w-12 text-gray-400/40" />
                </div>
            )}
        </CardContent>
    </Card>
);

// --- MAIN PREVIEW PANEL ---

export function PreviewPanel({ numberOfSlides, aspectRatio, carouselImages, isGenerating, generationStage, carouselData, carouselId }: PreviewPanelProps) {
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
      <div className="w-full flex-shrink-0 flex items-center justify-between gap-3 p-2 bg-glass rounded-lg border border-white/10 min-h-[60px] z-10">
        {hasResult ? (
          <>
            <h4 className="font-bold text-lg text-gray-50">Your Carousel</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"> 
                <Download className="h-4 w-4 mr-2" /> Download All 
              </Button>
            </div>
          </>
        ) : (
           <div className="flex flex-col items-center text-center w-full">
             <h4 className="font-bold text-lg text-gray-50">Content Preview</h4>
             <p className="text-sm text-gray-200">Your generated slides will appear here.</p>
           </div>
        )}
      </div>

      {/* Main Carousel Area */}
       <div className="w-full flex flex-col items-center justify-start py-6">
            <div className="w-full max-w-sm">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {(hasResult ? slides : Array.from({ length: numberOfSlides })).map((slide, index) => (
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
             <div className="w-full max-w-sm px-2 mt-3 text-sm">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={selectedIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn("text-gray-100", !isCaptionExpanded && "line-clamp-2")}
                    >
                         {currentCaption}
                    </motion.p>
                </AnimatePresence>
                 {hasResult && currentCaption.length > 100 && ( // Rough estimate for line clamping
                     <Button
                         variant="link"
                         className="text-xs text-gray-300 hover:text-gray-100 p-0 h-auto mt-1"
                         onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                     >
                         {isCaptionExpanded ? '...less' : 'more...'}
                     </Button>
                 )}
            </div>

            {/* Standalone Navigation Controls */}
            <div className="flex items-center justify-center gap-2 rounded-full bg-glass border border-white/10 p-1 shadow-lg backdrop-blur-sm mt-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-200 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:text-gray-500" onClick={() => api?.scrollPrev()} disabled={!api?.canScrollPrev()}>
                    <span className="sr-only">Previous slide</span>
                    &larr;
                </Button>
                
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <Button
                            key={index}
                            variant={index === selectedIndex ? 'default' : 'ghost'}
                            size="icon"
                            className={cn("h-8 w-8 rounded-full text-xs", 
                                index === selectedIndex 
                                    ? "bg-blue-500/30 text-blue-200 border border-blue-400/50 hover:bg-blue-500/40" 
                                    : "text-gray-200 hover:bg-white/10 hover:text-white"
                            )}
                            onClick={() => api?.scrollTo(index)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-200 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:text-gray-500" onClick={() => api?.scrollNext()} disabled={!api?.canScrollNext()}>
                     <span className="sr-only">Next slide</span>
                    &rarr;
                </Button>
            </div>
      </div>
    </div>
  );
} 