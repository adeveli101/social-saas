'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  color?: string
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
}

export function AnimatedChip({ 
  label, 
  selected = false, 
  onClick, 
  onRemove, 
  color = 'bg-blue-100 text-blue-800',
  className,
  disabled = false,
  icon
}: AnimatedChipProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Canlı renkler
  const activeBg = 'bg-primary/80 text-white border-primary shadow-lg'
  const activeBorder = 'border-primary'
  const hoverBg = 'bg-primary/60 text-white border-primary shadow-md'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={cn(
        'flex items-center px-3 py-1 rounded-full border border-transparent text-xs font-medium transition-all duration-200 shadow-sm',
        color,
        selected && activeBg,
        isHovered && !selected && hoverBg,
        selected && activeBorder,
        !disabled && 'hover:scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          color: selected ? 'hsl(var(--primary))' : undefined
        }}
        transition={{ duration: 0.2 }}
        className="flex items-center capitalize"
      >
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </motion.span>
      {selected && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-1"
        >
          ✓
        </motion.span>
      )}
      {onRemove && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <X className="h-3 w-3 text-red-600" />
        </motion.button>
      )}
    </motion.button>
  )
}

interface AnimatedChipGroupProps {
  chips: Array<{
    id: string
    label: string
    selected?: boolean
    color?: string
    icon?: React.ReactNode
  }>
  onChipClick: (id: string) => void
  onChipRemove?: (id: string) => void
  className?: string
  disabled?: boolean
}

export function AnimatedChipGroup({ 
  chips, 
  onChipClick, 
  onChipRemove, 
  className,
  disabled = false 
}: AnimatedChipGroupProps) {
  return (
    <motion.div 
      className={cn('flex flex-wrap gap-2', className)}
      layout
    >
      <AnimatePresence>
        {chips.map((chip) => (
          <AnimatedChip
            key={chip.id}
            label={chip.label}
            selected={chip.selected}
            onClick={() => onChipClick(chip.id)}
            onRemove={onChipRemove ? () => onChipRemove(chip.id) : undefined}
            color={chip.color}
            disabled={disabled}
            icon={chip.icon}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
} 