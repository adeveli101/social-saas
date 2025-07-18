import React, { ReactNode } from "react";

export function AnimatedGradientText({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`text-gradient-animated inline-flex items-center ${className}`}>
      {children}
    </div>
  );
} 