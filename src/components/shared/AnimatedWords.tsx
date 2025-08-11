import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearTimeout(next);
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
      
      {/* Visible animated element with per-letter spring */}
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          ref={spanRef}
          className={`${currentGradient} whitespace-nowrap drop-shadow-lg ${className}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
        >
          {words[index].split("").map((ch, i2) => (
            <motion.span
              key={`${index}-${i2}-${ch}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.02 * i2, type: "spring", stiffness: 250, damping: 20 }}
              whileHover={{ y: -1, scale: 1.02 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}; 