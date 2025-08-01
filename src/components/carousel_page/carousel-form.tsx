import React from 'react'

interface CarouselFormProps {
  onSubmit: (data: any) => Promise<void>
  initialPrompt: string
}

export function CarouselForm({ onSubmit, initialPrompt }: CarouselFormProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Carousel Form</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Form component - Development in progress</p>
        <p className="text-sm text-gray-600">Initial prompt: {initialPrompt}</p>
      </div>
    </div>
  )
} 