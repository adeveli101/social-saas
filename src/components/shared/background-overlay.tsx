export function BackgroundOverlay() {
  // Responsive bokeh counts: sm 12, md 16, lg+ 20
  const width = typeof window !== 'undefined' ? window.innerWidth : 1440
  const count = width < 640 ? 12 : width < 1024 ? 16 : 20
  const bokeh = Array.from({ length: count })
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient from globals.css already applied to body */}
      <div className="sunbeam-overlay absolute inset-0" />
      <div className="hero-ray absolute inset-0" />
      <div className="hero-right-flares absolute inset-0" />
      <div className="hero-vignette-overlay absolute inset-0" />
      <div className="hero-bokeh absolute inset-0">
        {bokeh.map((_, i) => {
          const size = 10 + (i % 6) * 4
          const left = `${(i * 7 + 5) % 100}%`
          const bottom = `${(i * 6 + 10) % 100}%`
          const duration = `${14 + (i % 8) * 2}s`
          const delay = `${i * 0.6}s`
          const bg = i % 3 === 0
            ? 'radial-gradient(circle, rgba(16,185,129,0.9), rgba(16,185,129,0) 60%)'
            : 'radial-gradient(circle, rgba(56,189,248,0.9), rgba(56,189,248,0) 60%)'
          return (
            <span
              key={i}
              style={{ left, bottom, width: `${size}px`, height: `${size}px`, opacity: 0.28, animationDuration: duration, animationDelay: delay, background: bg }}
            />
          )
        })}
      </div>
    </div>
  )
}


