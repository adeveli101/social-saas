import React from 'react'

interface CarouselPreviewProps {
  carouselId: string
}

export function CarouselPreview({ carouselId }: CarouselPreviewProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Carousel Preview</h2>
      <p className="text-gray-600">Preview for carousel: {carouselId}</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>Preview component - Development in progress</p>
      </div>
    </div>
  )
} 