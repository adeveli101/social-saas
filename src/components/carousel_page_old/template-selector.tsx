'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, BookOpen, TrendingUp, Trash2, ChevronDown } from 'lucide-react'
import { UserTemplate, DEFAULT_CATEGORIES, TemplateCategory } from '@/lib/carousel-suggestions'
import { useRef } from 'react'
import { getUserTemplates, deleteUserTemplate, updateUserTemplate } from '@/lib/user-templates'
import { getDefaultTemplates } from '@/lib/carousel-suggestions'
import { useUser } from '@clerk/nextjs'

interface TemplateSelectorProps {
  onTemplateSelect: (template: UserTemplate) => void
  trigger?: React.ReactNode
  isLoading?: boolean
}

export function TemplateSelector({ onTemplateSelect, trigger, isLoading: isExternalLoading }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [templates, setTemplates] = useState<UserTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [recentTemplates, setRecentTemplates] = useState<UserTemplate[]>([])
  const [isRecentCollapsed, setIsRecentCollapsed] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
      // loadRecentTemplates will be called after templates are loaded
      setTimeout(() => searchInputRef.current?.focus(), 200)
    }
  }, [isOpen, isLoaded])

  // Load recent templates when templates state changes
  useEffect(() => {
    if (templates.length > 0) {
      loadRecentTemplates()
    }
  }, [templates])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      let loadedTemplates: UserTemplate[] = []
      const defaultTemplates = await getDefaultTemplates()
      
      if (user && user.id) {
        try {
          const userTemplates = await getUserTemplates(user.id)
          loadedTemplates = [...defaultTemplates, ...userTemplates] as any
        } catch (error) {
          console.error('Failed to load user templates, falling back to defaults only:', error)
          loadedTemplates = defaultTemplates
        }
      } else {
        loadedTemplates = defaultTemplates
      }
      setTemplates(loadedTemplates)
      // Recent templates will be loaded via useEffect above
    } catch (error) {
      console.error('Template loading error:', error)
      // Fallback to empty array if even default templates fail
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentTemplates = () => {
    try {
      const ids = JSON.parse(localStorage.getItem('recentTemplates') || '[]')
      console.log('Recent template IDs from localStorage:', ids)
      console.log('Available templates:', templates.length, templates.map(t => t.id))
      
      if (!Array.isArray(ids) || ids.length === 0) {
        console.log('No recent template IDs found')
        setRecentTemplates([])
        return
      }
      
      const foundTemplates = ids
        .map((id: string) => templates.find(t => t.id === id))
        .filter(Boolean) as UserTemplate[]
      
      console.log('Found recent templates:', foundTemplates.length, foundTemplates.map(t => t.name))
      setRecentTemplates(foundTemplates)
    } catch (error) {
      console.error('Error loading recent templates:', error)
      setRecentTemplates([])
    }
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
      // Only increment usage count for user templates, not default templates
      if (template.user_id && user && user.id === template.user_id) {
        // Note: usageCount tracking removed as it's not in database schema
        // await updateUserTemplate(template.id, { usageCount: template.usageCount + 1 })
      }
      updateRecentTemplates(template)
      onTemplateSelect(template)
      setIsOpen(false)
    } catch (error) {
      console.error('Template usage count update error:', error)
      // Don't block template selection if usage count update fails
      updateRecentTemplates(template)
      onTemplateSelect(template)
      setIsOpen(false)
    }
  }

  // Add delete support for user templates
  const handleDeleteTemplate = async (templateId: string) => {
    if (!user || !user.id) return
    try {
      await deleteUserTemplate(templateId)
      setTemplates(prev => prev.filter(t => t.id !== templateId))
    } catch (error) {
      alert('Failed to delete template')
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
  const allCategories = [
    'All',
    ...DEFAULT_CATEGORIES,
    ...templates.map(t => t.category).filter(cat => !DEFAULT_CATEGORIES.includes(cat as TemplateCategory))
  ];

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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 hover:scale-105 transition-transform hover:shadow-md"
            disabled={isExternalLoading}
          >
            {isExternalLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <BookOpen className="h-4 w-4" />
                </motion.div>
                Loading...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Load Template
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] min-h-[700px] overflow-y-auto p-0">
        <div className="flex h-[700px]">
          {/* Category Sidebar */}
          <div className="w-52 border-r bg-muted/30 p-4 flex flex-col gap-2">
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
                className={`text-left px-3 py-2 rounded font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  selectedCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'hover:bg-primary/10 text-foreground hover:text-primary'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({templates.filter(t => cat === 'All' || t.category === cat).length})
              </button>
            ))}
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-3xl font-bold">Template Library</DialogTitle>
              <DialogDescription>
                Select a pre-made template or one of your own to get started quickly.
              </DialogDescription>
            </DialogHeader>
            
            {/* Search bar (desktop) */}
            <div className="hidden md:block mb-4">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, topic, or audience..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">No templates found.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                {/* Recently Used Section */}
                {recentTemplates.length > 0 && selectedCategory === 'All' && (
                  <div className="mb-8">
                    <button
                      className="w-full flex justify-between items-center text-left text-xl font-bold mb-4"
                      onClick={() => setIsRecentCollapsed(!isRecentCollapsed)}
                    >
                      <span>Recently Used</span>
                      <motion.div
                        animate={{ rotate: isRecentCollapsed ? -90 : 0 }}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {!isRecentCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentTemplates.map(template => (
                              <TemplateCard 
                                key={template.id + '-recent'} 
                                template={template} 
                                onSelect={handleTemplateSelect} 
                                onDelete={handleDeleteTemplate} 
                                getPurposeColor={getPurposeColor} 
                                getTemplateIcon={getTemplateIcon}
                                formatDate={formatDate}
                                currentUserId={user?.id}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                {/* All Templates Section */}
                <h2 className="text-xl font-bold mb-4">
                  {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map(template => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={handleTemplateSelect} 
                      onDelete={handleDeleteTemplate} 
                      getPurposeColor={getPurposeColor} 
                      getTemplateIcon={getTemplateIcon}
                      formatDate={formatDate}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TemplateCard({
  template,
  onSelect,
  onDelete,
  getPurposeColor,
  getTemplateIcon,
  formatDate,
  currentUserId,
}: {
  template: UserTemplate
  onSelect: (template: UserTemplate) => void
  onDelete: (id: string) => void
  getPurposeColor: (purpose: string) => string
  getTemplateIcon: (purpose: string) => React.ReactNode
  formatDate: (date: Date) => string
  currentUserId?: string
}) {
  const isUserTemplate = template.user_id === currentUserId
  
  return (
    <Card className="flex flex-col h-full bg-background/60 hover:bg-muted/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{template.name}</CardTitle>
            <CardDescription>{template.mainTopic}</CardDescription>
          </div>
          <Badge className={`flex items-center gap-1 ${getPurposeColor(template.purpose)}`}>
            {getTemplateIcon(template.purpose)}
            {template.purpose}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground mb-4">For: {template.audience}</p>
        <div className="flex justify-between items-center mt-auto">
          <Button onClick={() => onSelect(template)} size="sm" className="w-full mr-2">
            Use Template
          </Button>
          {isUserTemplate && (
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Are you sure you want to delete this template?')) {
                  onDelete(template.id)
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 