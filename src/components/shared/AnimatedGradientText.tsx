import React from "react";

export function AnimatedGradientText({ text, className = "" }: { text: string, className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) =>
        char === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span key={i} className="letter-gradient">{char}</span>
        )
      )}
    </span>
  );
} 