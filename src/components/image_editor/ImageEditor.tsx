import React from 'react'
import Image from 'next/image'

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImageUrl: string) => void
  onCancel: () => void
}

export function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Image Editor</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Image editor component - Development in progress</p>
        <Image src={imageUrl} alt="Edit" width={400} height={300} className="max-w-full h-auto" />
        <div className="flex gap-2">
          <button onClick={() => onSave(imageUrl)} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
} 