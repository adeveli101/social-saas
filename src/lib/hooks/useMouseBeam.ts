'use client'

import { useCallback, useRef } from 'react'

interface UseMouseBeamOptions {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  resetOnLeave?: boolean
  cssVarWidthName?: string
  cssVarHeightName?: string
  cssVarMouseXName?: string
  cssVarMouseYName?: string
}

interface UseMouseBeamResult<T extends HTMLElement = HTMLElement> {
  containerRef: React.RefObject<T>
  handleMouseMove: (e: React.MouseEvent<T>) => void
  handleMouseLeave: () => void
}

/**
 * Reusable hook to drive top-left sunbeam size by mouse proximity.
 * - Closer to top-left => smaller beam; closer to bottom-right => larger.
 * - Updates CSS variables on :root to be consumed from CSS.
 */
export function useMouseBeam<T extends HTMLElement = HTMLElement>({
  minWidth = 900,
  maxWidth = 1800,
  minHeight = 520,
  maxHeight = 1040,
  resetOnLeave = false,
  cssVarWidthName = '--beam-w',
  cssVarHeightName = '--beam-h',
  cssVarMouseXName = '--mx',
  cssVarMouseYName = '--my',
}: UseMouseBeamOptions = {}): UseMouseBeamResult<T> {
  const containerRef = useRef<T>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const element = containerRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()

    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height

    const mx = Math.max(0, Math.min(100, relX * 100))
    const my = Math.max(0, Math.min(100, relY * 100))
    document.documentElement.style.setProperty(cssVarMouseXName, `${mx}%`)
    document.documentElement.style.setProperty(cssVarMouseYName, `${my}%`)

    // Distance from top-left (0,0) normalized to 0..1 using sqrt(2)
    const distTL = Math.hypot(relX, relY)
    const norm = Math.min(1, distTL / Math.SQRT2) // 0..1

    const width = minWidth + norm * (maxWidth - minWidth)
    const height = minHeight + norm * (maxHeight - minHeight)
    document.documentElement.style.setProperty(cssVarWidthName, `${width}px`)
    document.documentElement.style.setProperty(cssVarHeightName, `${height}px`)
  }, [minWidth, maxWidth, minHeight, maxHeight, cssVarMouseXName, cssVarMouseYName, cssVarWidthName, cssVarHeightName])

  const handleMouseLeave = useCallback(() => {
    if (!resetOnLeave) return
    // Reset to defaults only if requested
    document.documentElement.style.setProperty(cssVarWidthName, `${maxWidth}px`)
    document.documentElement.style.setProperty(cssVarHeightName, `${maxHeight}px`)
  }, [resetOnLeave, cssVarWidthName, cssVarHeightName, maxWidth, maxHeight])

  return { containerRef, handleMouseMove, handleMouseLeave }
}



