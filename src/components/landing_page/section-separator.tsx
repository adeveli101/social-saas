interface SectionSeparatorProps {
  theme?: 'blue' | 'emerald' | 'violet' | 'pink' | 'amber'
}

const themeToClass: Record<Required<SectionSeparatorProps>['theme'], string> = {
  blue: 'via-blue-400/30',
  emerald: 'via-emerald-400/30',
  violet: 'via-violet-400/30',
  pink: 'via-pink-400/30',
  amber: 'via-amber-400/30',
}

export function SectionSeparator({ theme = 'blue' }: SectionSeparatorProps) {
  const glowClass = themeToClass[theme]
  return (
    <div className="relative my-12 md:my-16">
      <div className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className={`h-1 w-24 rounded-full bg-gradient-to-r from-transparent ${glowClass} to-transparent blur-[2px]`} />
      </div>
    </div>
  )
}


