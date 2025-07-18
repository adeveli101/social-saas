import React from 'react'

export interface CardDetailModalProps {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function CardDetailModal({ open, onClose, children }: CardDetailModalProps) {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-glass backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
} 