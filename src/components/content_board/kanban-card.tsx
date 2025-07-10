import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag, FileText } from 'lucide-react'

const PRIORITY_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
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
      className="group bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-border/80 cursor-pointer transition-all duration-200 hover:scale-[1.02] select-none"
      onClick={onClick}
      draggable={draggable}
      data-draggable-id={id}
      tabIndex={0}
      role="button"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">
          {title}
        </h4>
        {priority && (
          <Badge variant={PRIORITY_VARIANTS[priority] || 'default'} className="text-xs shrink-0">
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        )}
      </div>

      {/* Meta Information */}
      <div className="space-y-2 mb-3">
        {category && category.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-muted-foreground" />
            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
              {category.join(', ')}
            </Badge>
          </div>
        )}
        
        {plannedDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(plannedDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Notes Preview */}
      {notes && (
        <div className="mb-3 p-2 bg-muted/50 rounded-lg border border-border/50">
          <div className="flex items-start gap-1.5">
            <FileText className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {notes}
            </p>
          </div>
        </div>
      )}

      {/* Drag Handle */}
      {draggable && (
        <div className="flex justify-center pt-2 border-t border-border/50">
          <div className="w-8 h-1 bg-muted rounded-full group-hover:bg-muted-foreground/20 transition-colors"></div>
        </div>
      )}

      {children}
    </div>
  )
} 