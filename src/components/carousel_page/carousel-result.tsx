import React from 'react'

interface CarouselResultProps {
  result: Record<string, unknown>
  onRestart: () => void
}

export function CarouselResult({ result, onRestart }: CarouselResultProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Carousel Result</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Result component - Development in progress</p>
        <button onClick={onRestart} className="text-sm text-blue-600">Restart</button>
      </div>
    </div>
  )
} 