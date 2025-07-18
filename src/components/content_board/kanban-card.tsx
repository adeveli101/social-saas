import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag, FileText } from 'lucide-react'

const PRIORITY_VARIANTS: Record<string, string> = {
  low: 'bg-gray-500/20 text-gray-200 border-gray-400/50',
  medium: 'bg-blue-500/20 text-blue-200 border-blue-400/50',
  high: 'bg-red-500/20 text-red-200 border-red-400/50',
}

export interface KanbanCardProps {
  id?: string
  title: string
  category?: string[]
  priority?: 'low' | 'medium' | 'high'
  plannedDate?: string | null
  notes?: string | null
  onClick?: () => void
  draggable?: boolean
  children?: React.ReactNode
}

export function KanbanCard({ id, title, category, priority, plannedDate, notes, onClick, draggable, children }: KanbanCardProps) {
  return (
    <div
      className="group bg-glass backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-white/20 cursor-pointer transition-all duration-200 hover:scale-[1.02] select-none"
      onClick={onClick}
      draggable={draggable}
      data-draggable-id={id}
      tabIndex={0}
      role="button"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-semibold text-gray-50 line-clamp-2 text-sm leading-tight">
          {title}
        </h4>
        {priority && (
          <Badge className={`text-xs shrink-0 ${PRIORITY_VARIANTS[priority] || PRIORITY_VARIANTS.medium}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        )}
      </div>

      {/* Meta Information */}
      <div className="space-y-2 mb-3">
        {category && category.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-gray-400" />
            <Badge className="text-xs bg-white/10 text-gray-200 border-white/20">
              {category.join(', ')}
            </Badge>
          </div>
        )}
        
        {plannedDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Calendar className="w-3 h-3" />
            <span>{new Date(plannedDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Notes Preview */}
      {notes && (
        <div className="mb-3 p-2 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start gap-1.5">
            <FileText className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
              {notes}
            </p>
          </div>
        </div>
      )}

      {/* Drag Handle */}
      {draggable && (
        <div className="flex justify-center pt-2 border-t border-white/10">
          <div className="w-8 h-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors"></div>
        </div>
      )}

      {children}
    </div>
  )
} 