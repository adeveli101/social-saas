import React from "react";

export function StaticGradientText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`text-gradient ${className}`}>{children}</span>
  );
} 