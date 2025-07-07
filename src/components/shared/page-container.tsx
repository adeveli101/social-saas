import React from "react"
import clsx from "clsx"

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  gradient?: "hero" | "features" | "card" | "none"
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
  const gradientClass =
    gradient === "hero"
      ? "landing-hero-gradient"
      : gradient === "features"
      ? "landing-features-gradient"
      : gradient === "card"
      ? "landing-card-gradient"
      : ""

  return (
    <section
      id={id}
      className={clsx(gradientClass, className, animate && "aos-init aos-animate")}
      data-aos={animate ? "fade-up" : undefined}
    >
      <div className={clsx("container mx-auto px-4", containerClassName, center && "text-center")}>
        {title && (
          <h2 className={clsx("font-extrabold mb-4 text-foreground", titleClassName)}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-main page-fade transition-all">
      {children}
    </div>
  )
} 