import React from 'react'
import { Inbox, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface KanbanColumnProps {
  title: string
  children?: React.ReactNode
  className?: string
  droppableId?: string
  icon?: React.ReactNode
  color?: string
  statusKey?: string
  onAddNewIdea?: () => void
}

export function KanbanColumn({ title, children, className, droppableId, icon, color, statusKey, onAddNewIdea }: KanbanColumnProps) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0)

  return (
    <section
      className={`flex flex-col bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-w-[260px] max-w-xs mx-auto ${className || ''}`}
      data-droppable-id={droppableId}
      tabIndex={0}
    >
      {/* Column Header */}
      <div className={`flex items-center gap-3 px-4 h-16 rounded-t-2xl ${color || 'bg-muted'} border-b border-border`}> 
        {icon && (
          <div className="p-2 bg-muted rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-foreground truncate">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {Array.isArray(children) ? children.length : 0} items
          </p>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-2 py-4 gap-3 min-h-[320px]">
        {isEmpty && statusKey === 'idea' ? (
          <div className="flex flex-col items-center justify-center flex-1 h-full w-full py-8">
            <Lightbulb className="w-10 h-10 mb-3 text-primary" />
            <h3 className="text-lg font-semibold mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first content idea.</p>
            <Button onClick={onAddNewIdea} size="lg">+ Add New Idea</Button>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 h-full w-full py-8">
            <Inbox className="w-10 h-10 mb-3 text-muted-foreground/70" />
            <p className="text-base font-medium text-muted-foreground">No content at this stage</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {children}
          </div>
        )}
      </div>
    </section>
  )
} 