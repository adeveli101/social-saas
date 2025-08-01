import React from 'react'

interface GenerationHistoryProps {
  // Add props as needed
}

export function GenerationHistory({}: GenerationHistoryProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Generation History</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">No generation history available</p>
      </div>
    </div>
  )
} 