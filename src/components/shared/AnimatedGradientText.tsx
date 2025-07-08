import React from "react";

export function AnimatedGradientText({ text, className = "" }: { text: string, className?: string }) {
  return (
    <span className={`heading-gradient heading heading-foreground ${className}`}>
      {text}
    </span>
  );
} 