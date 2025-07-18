import React, { useEffect, useRef, useState } from "react";

interface AnimatedWordsProps {
  words: string[];
  className?: string;
  interval?: number; // ms
  gradients?: string[]; // Her kelime için farklı gradient class'ı
}

export const AnimatedWords: React.FC<AnimatedWordsProps> = ({
  words,
  className = "",
  interval = 2000,
  gradients,
}) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const spanRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure the widest word on mount
  useEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.offsetWidth);
    }
  }, [words]);

  useEffect(() => {
    const fadeOut = setTimeout(() => setFade(false), interval - 400);
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      setFade(true);
    }, interval);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(next);
    };
  }, [index, interval, words.length]);

  // Get the current gradient class - Ultra-dark gradient theme
  const currentGradient = gradients?.[index] || "text-gradient-animated";

  return (
    <div className="relative inline-block" style={{ minWidth: width }}>
      {/* Invisible element for measuring maximum width */}
      <span
        ref={measureRef}
        className="invisible absolute top-0 left-0 text-gradient-animated whitespace-nowrap"
        aria-hidden="true"
      >
        {words.reduce((longest, word) => 
          word.length > longest.length ? word : longest, ""
        )}
      </span>
      
      {/* Visible animated element with enhanced visibility */}
      <span
        ref={spanRef}
        className={`${currentGradient} whitespace-nowrap transition-opacity duration-500 drop-shadow-lg ${
          fade ? "opacity-100" : "opacity-0"
        } ${className}`}
        style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
      >
        {words[index]}
      </span>
    </div>
  );
}; 