'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Image as ImageIcon, Sparkles, Download, Copy, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GenerationStage = 'form' | 'generating' | 'result';
interface Slide {
  imageUrl: string;
  caption: string;
}
interface PreviewPanelProps {
  numberOfSlides: number;
  stage: GenerationStage;
  aspectRatio: '1:1' | '4:5';
  progress?: { percent: number; message: string; currentSlide?: number };
  result?: { slides: Slide[] } | null;
  onRestart: () => void;
}

function PlaceholderCard({ aspectRatio, index, isGenerating, progress }: { aspectRatio: string, index: number, isGenerating: boolean, progress?: PreviewPanelProps['progress'] }) {
  const isActive = isGenerating && progress?.currentSlide === index + 1;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 overflow-hidden transition-all",
        aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[4/5]',
        isActive && "border-blue-600 shadow-xl shadow-blue-600/20"
      )}
    >
      <AnimatePresence>
        {!isGenerating && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="flex flex-col items-center justify-center"
          >
            {/* Content removed for minimalist design */}
          </motion.div>
        )}
      </AnimatePresence>
       {isGenerating && (
        <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center">
          {isActive ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="text-blue-500 h-8 w-8" />
              </motion.div>
              <p className="mt-2 text-xs font-semibold text-blue-400">
                {progress?.message || `Working on slide ${index + 1}...`}
              </p>
            </>
          ) : (
            <p className="text-xs text-zinc-500">Waiting...</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function GenerationProgress({ percent }: { percent: number }) {
    return (
        <div className="w-full max-w-md mx-auto space-y-3">
            <h3 className="text-lg font-semibold text-center text-zinc-200">AI is creating your masterpiece...</h3>
            <div className="w-full bg-zinc-800 rounded-full h-2.5">
                <motion.div
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
            <p className="text-sm text-center text-zinc-400">{Math.round(percent)}% complete</p>
        </div>
    )
}

function CarouselResultViewer({ result, aspectRatio, onRestart }: { result: { slides: Slide[] }, aspectRatio: string, onRestart: () => void }) {
  const [current, setCurrent] = useState(0);
  const slides = result.slides;

  const handleDownload = (url: string, name: string) => {
    // Basic download logic
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-4 text-white">
      <div className="relative w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center">
        {slides.length > 0 && (
          <img
            src={slides[current].imageUrl}
            alt={`Slide ${current + 1}`}
            className={cn(
              "w-full object-cover rounded-lg shadow-lg mb-4",
              aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[4/5]'
            )}
            draggable={false}
          />
        )}
        <div className="flex items-center justify-between w-full mb-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}><ArrowLeft /></Button>
          <span className="text-sm text-zinc-400">Slide {current + 1} / {slides.length}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))} disabled={current === slides.length - 1}><ArrowRight /></Button>
        </div>
        <div className="w-full bg-zinc-800 rounded-lg p-3 text-sm text-zinc-300">
          {slides[current]?.caption || ""}
        </div>
      </div>
       <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onRestart} variant="outline" className="border-zinc-700 hover:bg-zinc-800">
          Create New Carousel
        </Button>
      </div>
    </div>
  );
}


export function PreviewPanel({ numberOfSlides, stage, aspectRatio, progress, result, onRestart }: PreviewPanelProps) {
  const renderContent = () => {
    switch (stage) {
      case 'result':
        return result ? <CarouselResultViewer result={result} aspectRatio={aspectRatio} onRestart={onRestart} /> : <div>Something went wrong.</div>;
      case 'generating':
      case 'form':
      default:
        return (
          <div className="w-full max-w-6xl mx-auto">
            {stage === 'generating' && progress && (
                <div className="mb-8">
                    <GenerationProgress percent={progress.percent} />
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence>
                {Array.from({ length: numberOfSlides }).map((_, index) => (
                  <PlaceholderCard 
                    key={index} 
                    aspectRatio={aspectRatio} 
                    index={index} 
                    isGenerating={stage === 'generating'}
                    progress={progress}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {renderContent()}
    </div>
  );
} 