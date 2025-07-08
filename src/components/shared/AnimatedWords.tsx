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

  // Find the longest word for width calculation
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span
      style={{
        display: "inline-block",
        minWidth: width ? width : undefined,
        transition: "min-width 0.2s cubic-bezier(0.4,0,0.2,1)",
        verticalAlign: "bottom",
      }}
      className={className}
    >
      {/* Hidden span for measuring width */}
      <span
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none select-none font-inherit text-inherit"
        aria-hidden
      >
        {longestWord}
      </span>
      {/* Animated word */}
      <span
        ref={spanRef}
        className={
          `inline-block transition-all duration-400 ease-in-out ` +
          (fade
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2") +
          " bg-clip-text text-transparent font-semibold drop-shadow-sm " +
          (gradients && gradients[index] ? gradients[index] : "bg-gradient-to-r from-[var(--heading-gradient-from)] via-[var(--heading-gradient-via)] to-[var(--heading-gradient-to)]")
        }
        style={{ willChange: "opacity, transform" }}
      >
        {words[index]}
      </span>
    </span>
  );
}; 