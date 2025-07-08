import React from "react";

export function StaticGradientText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`heading-gradient heading heading-foreground ${className}`}>{children}</span>
  );
} 