'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, BookOpen, TrendingUp } from 'lucide-react'
import { UserTemplate, getTemplates, incrementTemplateUsage, DEFAULT_CATEGORIES, TemplateCategory } from '@/lib/carousel-suggestions'
import { useRef } from 'react'

interface TemplateSelectorProps {
  onTemplateSelect: (template: UserTemplate) => void
  trigger?: React.ReactNode
}

export function TemplateSelector({ onTemplateSelect, trigger }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [templates, setTemplates] = useState<UserTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [recentTemplates, setRecentTemplates] = useState<UserTemplate[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
      loadRecentTemplates()
      setTimeout(() => searchInputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const loadedTemplates = await getTemplates()
      setTemplates(loadedTemplates)
    } catch (error) {
      console.error('Template loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentTemplates = () => {
    try {
      const ids = JSON.parse(localStorage.getItem('recentTemplates') || '[]')
      if (!Array.isArray(ids)) return
      setRecentTemplates(
        ids
          .map((id: string) => templates.find(t => t.id === id))
          .filter(Boolean) as UserTemplate[]
      )
    } catch {}
  }

  const updateRecentTemplates = (template: UserTemplate) => {
    try {
      let ids = JSON.parse(localStorage.getItem('recentTemplates') || '[]')
      if (!Array.isArray(ids)) ids = []
      ids = [template.id, ...ids.filter((id: string) => id !== template.id)].slice(0, 5)
      localStorage.setItem('recentTemplates', JSON.stringify(ids))
      setRecentTemplates(ids.map((id: string) => templates.find(t => t.id === id)).filter(Boolean) as UserTemplate[])
    } catch {}
  }

  const handleTemplateSelect = async (template: UserTemplate) => {
    try {
      await incrementTemplateUsage(template.id)
      updateRecentTemplates(template)
      onTemplateSelect(template)
      setIsOpen(false)
    } catch (error) {
      console.error('Template usage count update error:', error)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  const getTemplateIcon = (purpose: string) => {
    switch (purpose.toLowerCase()) {
      case 'educate':
        return <BookOpen className="h-4 w-4" />
      case 'sell':
        return <TrendingUp className="h-4 w-4" />
      case 'inspire':
        return <Star className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getPurposeColor = (purpose: string) => {
    switch (purpose.toLowerCase()) {
      case 'educate':
        return 'bg-blue-100 text-blue-800'
      case 'sell':
        return 'bg-green-100 text-green-800'
      case 'inspire':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Categories and All
  const allCategories = ['All', ...DEFAULT_CATEGORIES, ...templates.map(t => t.category).filter(cat => !DEFAULT_CATEGORIES.includes(cat as TemplateCategory))]

  // Search filtering
  const filteredTemplates = templates.filter(t => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      t.name.toLowerCase().includes(q) ||
      t.mainTopic.toLowerCase().includes(q) ||
      t.audience.toLowerCase().includes(q) ||
      t.keyPoints.join(',').toLowerCase().includes(q)
    )
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Load Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] min-h-[600px] min-w-[900px] overflow-y-auto p-0">
        <div className="flex h-[600px]">
          {/* Category Sidebar */}
          <div className="w-48 border-r bg-muted/30 p-4 flex flex-col gap-2">
            {/* Search bar (mobile only) */}
            <div className="block md:hidden mb-2">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {allCategories.map((cat, idx) => (
              <button
                key={cat + '-' + idx}
                className={`text-left px-3 py-2 rounded font-medium transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-primary/10 text-foreground'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Template Cards */}
          <div className="flex-1 p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Choose a Template
              </DialogTitle>
              <DialogDescription>
                Select a saved template to quickly fill in your carousel details.
              </DialogDescription>
            </DialogHeader>
            {/* Search bar (desktop) */}
            <div className="hidden md:block mb-4">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-4 py-2 rounded border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {/* Recently Used Templates */}
            {recentTemplates.length > 0 && (
              <div className="mb-6">
                <div className="font-semibold text-sm text-foreground mb-2">Recently Used</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {recentTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.07 }}
                    >
                      {/* Card rendering, same as below */}
                      <Card 
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 w-full max-w-full min-h-[220px] sm:min-h-[220px] md:min-h-[260px] md:h-[260px] flex flex-col p-5"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardHeader className="pb-1 pt-0 px-0 flex-shrink-0">
                              <div className="flex flex-col gap-1 min-w-0">
                                <CardTitle className="text-base md:text-lg flex items-center gap-2 truncate font-semibold">
                                  {getTemplateIcon(template.purpose)}
                                  <span className="truncate">{template.name}</span>
                                </CardTitle>
                                {/* Category and Purpose Badges under the title */}
                                <div className="flex flex-row flex-wrap gap-2 mt-0.5 items-center">
                                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground font-normal">
                                    {template.category}
                                  </Badge>
                                  <Badge className={`${getPurposeColor(template.purpose)} text-[10px] px-2 py-0.5 rounded-md shadow-sm`}>
                                    {template.purpose}
                                  </Badge>
                                </div>
                                <CardDescription className="mt-1 truncate text-xs md:text-sm text-muted-foreground">
                                  {template.mainTopic} • {template.audience}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 flex-1 flex flex-col justify-between px-0 pb-0">
                              <div className="space-y-1 flex-1">
                                <div className="text-xs md:text-sm text-muted-foreground">
                                  <span className="font-semibold">Key Points:</span>
                                  <div className="line-clamp-2 mt-0.5 text-[11px] md:text-xs leading-tight">{template.keyPoints.join(', ')}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[12px] md:text-sm text-muted-foreground mt-4 pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDate(template.createdAt)}
                                </div>
                                {template.usageCount > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Popular
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <BookOpen className="h-8 w-8 text-primary" />
                  </motion.div>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredTemplates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No templates found in this category.</p>
                      <p className="text-sm">Create your first template to get started!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {filteredTemplates.map((template, index) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.07 }}
                        >
                          <Card 
                            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 w-full max-w-full min-h-[220px] sm:min-h-[220px] md:min-h-[260px] md:h-[260px] flex flex-col p-5"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardHeader className="pb-1 pt-0 px-0 flex-shrink-0">
                              <div className="flex flex-col gap-1 min-w-0">
                                <CardTitle className="text-base md:text-lg flex items-center gap-2 truncate font-semibold">
                                  {getTemplateIcon(template.purpose)}
                                  <span className="truncate">{template.name}</span>
                                </CardTitle>
                                {/* Category and Purpose Badges under the title */}
                                <div className="flex flex-row flex-wrap gap-2 mt-0.5 items-center">
                                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground font-normal">
                                    {template.category}
                                  </Badge>
                                  <Badge className={`${getPurposeColor(template.purpose)} text-[10px] px-2 py-0.5 rounded-md shadow-sm`}>
                                    {template.purpose}
                                  </Badge>
                                </div>
                                <CardDescription className="mt-1 truncate text-xs md:text-sm text-muted-foreground">
                                  {template.mainTopic} • {template.audience}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 flex-1 flex flex-col justify-between px-0 pb-0">
                              <div className="space-y-1 flex-1">
                                <div className="text-xs md:text-sm text-muted-foreground">
                                  <span className="font-semibold">Key Points:</span>
                                  <div className="line-clamp-2 mt-0.5 text-[11px] md:text-xs leading-tight">{template.keyPoints.join(', ')}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[12px] md:text-sm text-muted-foreground mt-4 pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDate(template.createdAt)}
                                </div>
                                {template.usageCount > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Popular
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 