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
      className={`flex flex-col bg-glass backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[260px] max-w-xs mx-auto ${className || ''}`}
      data-droppable-id={droppableId}
      tabIndex={0}
    >
      {/* Column Header */}
      <div className={`flex items-center gap-3 px-4 h-16 rounded-t-2xl ${color || 'bg-white/5'} border-b border-white/10`}> 
        {icon && (
          <div className="p-2 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-gray-50 truncate">{title}</h3>
          <p className="text-xs text-gray-300 truncate">
            {Array.isArray(children) ? children.length : 0} items
          </p>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 flex flex-col justify-start items-center px-2 py-6 gap-3 min-h-[320px]">
        {isEmpty && statusKey === 'idea' ? (
          <div className="flex flex-col items-center justify-start text-center flex-1 w-full py-4">
            <Lightbulb className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-lg font-semibold mb-2 text-gray-50">No carousel ideas yet</h3>
            <p className="text-gray-300 mb-6 text-sm">Start by adding your first carousel concept.</p>
            <Button onClick={onAddNewIdea} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">+ Add New Carousel</Button>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-start text-center flex-1 w-full py-4">
            <Inbox className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-base font-medium text-gray-300">No carousels at this stage</p>
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