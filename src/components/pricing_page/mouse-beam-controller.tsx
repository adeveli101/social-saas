'use client'

import React from 'react'
import { useMouseBeam } from '@/lib/hooks/useMouseBeam'

interface MouseBeamControllerProps {
  children: React.ReactNode
  className?: string
}

export function MouseBeamController({ children, className }: MouseBeamControllerProps) {
  const { containerRef, handleMouseMove, handleMouseLeave } = useMouseBeam<HTMLDivElement>({ resetOnLeave: false })
  return (
    <div ref={containerRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}


