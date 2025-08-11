"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getContentTasks, updateContentTask, moveContentTask, createContentTask, deleteContentTask } from '@/lib/content-board'
import type { Database } from '@/lib/database.types'

type ContentTask = Database['public']['Tables']['content_tasks']['Row']
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { CardDetailModal } from './card-detail-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Calendar as CalendarIcon, Tag, FileText, Sparkles, Trash2, Edit3, Move, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { DateRange } from 'react-day-picker'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

const STATUS_LIST: { key: ContentTask['status']; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'idea', label: 'Carousel Ideas', icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-500/20 border-purple-400/50' },
  { key: 'in_progress', label: 'Generating', icon: <Clock className="w-4 h-4" />, color: 'bg-blue-500/20 border-blue-400/50' },
  { key: 'to_review', label: 'Review & Edit', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-yellow-500/20 border-yellow-400/50' },
  { key: 'ready_to_post', label: 'Ready to Download', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500/20 border-green-400/50' },
  { key: 'posted', label: 'Downloaded', icon: <Zap className="w-4 h-4" />, color: 'bg-gray-500/20 border-gray-400/50' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-500/20 text-gray-200 border-gray-400/50' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-blue-500/20 text-blue-200 border-blue-400/50' },
  { value: 'high', label: 'High Priority', color: 'bg-red-500/20 text-red-200 border-red-400/50' },
]

const CATEGORY_SUGGESTIONS = [
  'Instagram Carousel', 'LinkedIn Carousel', 'Facebook Carousel', 'Educational Content', 
  'Product Showcase', 'Tips & Tricks', 'Infographic Style', 'Quote Cards', 'Case Study', 
  'How-To Guide', 'Statistics', 'Before & After'
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<ContentTask[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<ContentTask | null>(null)
  const [editNotes, setEditNotes] = useState('')
  const [editPriority, setEditPriority] = useState<ContentTask['priority']>('medium')
  const [editStatus, setEditStatus] = useState<ContentTask['status']>('idea')
  const [saving, setSaving] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addTitle, setAddTitle] = useState('')
  const [addCategory, setAddCategory] = useState('')
  const [addPriority, setAddPriority] = useState<ContentTask['priority']>('medium')
  const [addPlannedDate, setAddPlannedDate] = useState('')
  const [addNotes, setAddNotes] = useState('')
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const userId = user?.id || ''
  const [search, setSearch] = useState("")
  const [account, setAccount] = useState("all")
  const [assigned, setAssigned] = useState("all")
  const [contentType, setContentType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      try {
        if (!userId) return
        const data = await getContentTasks(userId)
        setTasks(data)
      } catch (e) {
        console.error('Failed to fetch tasks:', e)
      } finally {
        setLoading(false)
      }
    }
    if (isLoaded) fetchTasks()
  }, [userId, isLoaded])

  useEffect(() => {
    if (selectedTask) {
      setEditNotes(selectedTask.notes || '')
      setEditPriority(selectedTask.priority)
      setEditStatus(selectedTask.status)
    }
  }, [selectedTask])

  async function handleSave() {
    if (!selectedTask) return
    setSaving(true)
    try {
      const updated = await updateContentTask(selectedTask.id, {
        notes: editNotes,
        priority: editPriority,
        status: editStatus,
      })
      setTasks(tasks => tasks.map(t => t.id === updated.id ? updated : t))
      setSelectedTask(updated)
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(newStatus: ContentTask['status']) {
    if (!selectedTask) return
    setSaving(true)
    try {
      const updated = await moveContentTask(selectedTask.id, newStatus)
      setTasks(tasks => tasks.map(t => t.id === updated.id ? updated : t))
      setSelectedTask(updated)
      setEditStatus(newStatus)
    } catch (error) {
      console.error('Failed to change status:', error)
    } finally {
      setSaving(false)
    }
  }

  function handleCarouselCreate() {
    if (!selectedTask) return
    const prompt = encodeURIComponent(selectedTask.title)
    router.push(`/carousel?from=content-board&prompt=${prompt}`)
  }

  async function handleDelete() {
    if (!selectedTask) return
    setSaving(true)
    try {
      await deleteContentTask(selectedTask.id)
      setTasks(tasks => tasks.filter(t => t.id !== selectedTask.id))
      setSelectedTask(null)
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault()
    setAddError('')
    if (!addTitle.trim()) {
      setAddError('Title is required.')
      return
    }
    setAddLoading(true)
    try {
      const newTask = await createContentTask({
        user_id: userId,
        title: addTitle,
        description: null,
        status: 'idea',
        planned_date: addPlannedDate || null,
        category: addCategory ? [addCategory] : [],
        priority: addPriority,
        notes: addNotes,
        carousel_id: null,
        due_date: null,
      })
      setTasks(tasks => [newTask, ...tasks])
      setAddTitle('')
      setAddCategory('')
      setAddPriority('medium')
      setAddPlannedDate('')
      setAddNotes('')
      setAddDialogOpen(false)
    } catch (err) {
      setAddError('Failed to add card.')
    } finally {
      setAddLoading(false)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || !active) return
    const cardId = active.id as string
    const newStatus = over.id as ContentTask['status']
    const card = tasks.find(t => t.id === cardId)
    if (!card || card.status === newStatus) return
    setTasks(tasks => tasks.map(t => t.id === cardId ? { ...t, status: newStatus } : t))
    try {
      await moveContentTask(cardId, newStatus)
    } catch (error) {
      console.error('Failed to move task:', error)
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'posted').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length

  // Calculate new stats
  const now = new Date();
  const weekFromNow = new Date(now);
  weekFromNow.setDate(now.getDate() + 7);
  const plannedThisWeek = tasks.filter(t => t.planned_date && new Date(t.planned_date) >= now && new Date(t.planned_date) <= weekFromNow).length;
  const pendingReview = tasks.filter(t => t.status === 'to_review').length;
  const publishedThisMonth = tasks.filter(t => t.status === 'posted' && t.planned_date && new Date(t.planned_date).getMonth() === now.getMonth() && new Date(t.planned_date).getFullYear() === now.getFullYear()).length;

  if (loading || !isLoaded || !userId) {
    return (
      <div className="w-full flex justify-center items-center py-20 bg-gradient-natural min-h-screen">
        <div className="flex flex-col items-center gap-4 text-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p>Loading your content board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-natural">
      <div className="relative overflow-visible w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-50">
                Carousel Planning Board
              </h1>
              <p className="text-gray-200 mt-2">
                Organize and track your AI carousel creation workflow
              </p>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Carousel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-glass backdrop-blur-xl border border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-gray-50">Create New Carousel Idea</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Add a new carousel concept to your planning board.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={addTitle}
                      onChange={e => setAddTitle(e.target.value)}
                      placeholder="Enter carousel idea title..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={addCategory} onValueChange={setAddCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_SUGGESTIONS.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={addPriority} onValueChange={(value: ContentTask['priority']) => setAddPriority(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Planned Date</Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={addPlannedDate}
                        onChange={e => setAddPlannedDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={addNotes}
                      onChange={e => setAddNotes(e.target.value)}
                      placeholder="Add carousel details, target audience, key messages..."
                      rows={3}
                    />
                  </div>
                  {addError && (
                    <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                      {addError}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={addLoading} className="flex-1">
                      {addLoading ? 'Creating...' : 'Create Task'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter/Search Bar */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <Input
              placeholder="Search content..."
              className="w-56"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All Accounts" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="social">Social Post</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="blog">Blog Post</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigned} onValueChange={setAssigned}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Assigned User" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Anyone</SelectItem>
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Content Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="single">Single Post</SelectItem>
              </SelectContent>
            </Select>
            {/* Date range picker */}
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-56 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0 z-[9999]">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Planned This Week</p>
                    <p className="text-2xl font-bold text-foreground">{plannedThisWeek}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-foreground">{pendingReview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Published This Month</p>
                    <p className="text-2xl font-bold text-foreground">{publishedThisMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[70vh]">
            {STATUS_LIST.map((status) => (
              <KanbanColumn 
                key={status.key} 
                title={status.label} 
                droppableId={status.key}
                icon={status.icon}
                color={status.color}
                statusKey={status.key}
                onAddNewIdea={status.key === 'idea' ? () => setAddDialogOpen(true) : undefined}
              >
                {tasks.filter(task => task.status === status.key).map(task => (
                  <KanbanCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    category={task.category || []}
                    priority={task.priority as 'low' | 'medium' | 'high'}
                    plannedDate={task.planned_date}
                    notes={task.notes}
                    onClick={() => setSelectedTask(task)}
                    draggable
                  />
                ))}
              </KanbanColumn>
            ))}
          </div>
        </DndContext>
      </div>

      {/* Enhanced Modal */}
      <CardDetailModal open={!!selectedTask} onClose={() => setSelectedTask(null)}>
        {selectedTask && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{selectedTask.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {selectedTask.planned_date ? new Date(selectedTask.planned_date).toLocaleDateString() : 'No date set'}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Category:</span>
                {selectedTask.category && selectedTask.category.length > 0 ? (
                  <Badge variant="outline">{selectedTask.category.join(', ')}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editStatus} onValueChange={(value: ContentTask['status']) => handleStatusChange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_LIST.map(s => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={editPriority} onValueChange={(value: ContentTask['priority']) => setEditPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Add notes about this content..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              {selectedTask.status === 'idea' && (
                <Button variant="outline" onClick={handleCarouselCreate} disabled={saving}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Carousel
                </Button>
              )}
              <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardDetailModal>
    </div>
  )
} 