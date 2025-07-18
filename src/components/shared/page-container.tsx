import React from "react"
import clsx from "clsx"

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  gradient?: "hero" | "dramatic" | "pricing" | "glow-soft" | "glow-medium" | "glow-intense" | "aurora" | "natural" | "daylight" | "brand" | "none"
  id?: string
  animate?: boolean
  title?: string
  titleClassName?: string
  subtitle?: string
  center?: boolean
}

export function Section({
  children,
  className,
  containerClassName,
  gradient = "none",
  id,
  animate = false,
  title,
  titleClassName,
  subtitle,
  center = false,
}: SectionProps) {
  // Ultra-dark gradient theme mappings
  const gradientClass = {
    hero: "bg-gradient-natural", // Ultra-dark hero background
    dramatic: "bg-gradient-natural", // Ultra-dark dramatic background
    pricing: "bg-gradient-natural", // Ultra-dark pricing background
    "glow-soft": "bg-gradient-natural", // Soft ultra-dark glow
    "glow-medium": "bg-gradient-natural", // Medium ultra-dark glow
    "glow-intense": "bg-gradient-natural", // Intense ultra-dark glow
    aurora: "bg-gradient-natural", // Aurora ultra-dark effect
    natural: "bg-gradient-natural", // Natural ultra-dark gradient
    daylight: "bg-gradient-natural", // Daylight ultra-dark gradient
    brand: "bg-gradient-brand", // Brand ultra-dark gradient
    none: ""
  }[gradient]

  return (
    <section
      id={id}
      className={clsx(
        "w-full py-8 md:py-16",
        gradientClass,
        animate && "animate-ambientGlow",
        className
      )}
    >
      <div className={clsx("container mx-auto px-4 md:px-8", containerClassName)}>
        {(title || subtitle) && (
          <div className={clsx("mb-8 md:mb-12", center && "text-center")}>
            {title && (
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold text-gray-50 mb-4 drop-shadow-lg",
                titleClassName
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-200 max-w-2xl drop-shadow-md">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={clsx("min-h-screen bg-gradient-natural text-gray-50", className)}>
      {children}
    </div>
  )
} 