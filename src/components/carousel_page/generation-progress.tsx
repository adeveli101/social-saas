import React from 'react'

interface GenerationProgressProps {
  progress: { percent: number; message: string; currentSlide?: number }
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Generation Progress</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Progress component - Development in progress</p>
        <p className="text-sm text-gray-600">Progress: {progress.percent}% - {progress.message}</p>
      </div>
    </div>
  )
} 