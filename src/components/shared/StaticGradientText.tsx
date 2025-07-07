import React from "react";

export function StaticGradientText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`static-gradient-text ${className}`}>{children}</span>
  );
} 