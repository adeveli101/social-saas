'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Sparkles, Check, Plus, AlertCircle } from 'lucide-react'
import { UserTemplate, DEFAULT_CATEGORIES, TemplateCategory } from '@/lib/carousel-suggestions'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { createUserTemplate } from '../../../lib/user-templates'
import { useUser } from '@clerk/nextjs'

interface TemplateSaveDialogProps {
  mainTopic: string
  audience: string
  purpose: string
  keyPoints: string[]
  onTemplateSaved?: (template: UserTemplate) => void
  trigger?: React.ReactNode
}

export function TemplateSaveDialog({ 
  mainTopic, 
  audience, 
  purpose, 
  keyPoints, 
  onTemplateSaved,
  trigger 
}: TemplateSaveDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [category, setCategory] = useState<TemplateCategory>('Marketing')
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [error, setError] = useState('')
  const { user, isLoaded } = useUser()

  const handleSave = async () => {
    if (!templateName.trim() || !category) {
      setError('Please fill in all required fields')
      return
    }
    if (!user || !user.id) {
      setError('You must be signed in to save templates.')
      return
    }
    setIsSaving(true)
    setError('')
    try {
      const newTemplate = await createUserTemplate({
        name: templateName.trim(),
        mainTopic,
        audience,
        purpose,
        keyPoints,
        category: showCustomCategory && customCategory.trim() ? (customCategory.trim() as TemplateCategory) : category
      }, user.id)
      setIsSaved(true)
      onTemplateSaved?.(newTemplate)
      setTimeout(() => {
        setIsOpen(false)
        setIsSaved(false)
        setTemplateName('')
        setCustomCategory('')
        setShowCustomCategory(false)
        setError('')
      }, 2000)
    } catch (error) {
      console.error('Template saving error:', error)
      setError('Failed to save template. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset form when dialog closes
      setTemplateName('')
      setCustomCategory('')
      setShowCustomCategory(false)
      setError('')
      setIsSaved(false)
    }
  }

  const canSave = templateName.trim().length > 0 && (showCustomCategory ? customCategory.trim().length > 0 : !!category) && !isSaving

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 hover:scale-105 transition-transform hover:shadow-md"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Save className="h-4 w-4" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save as Template
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Save as Template
          </DialogTitle>
          <DialogDescription>
            Save this combination as a reusable template for future use.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800 text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              placeholder="e.g. Weekly Marketing Tips"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSave) {
                  handleSave()
                }
              }}
              className="focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2 items-center">
              <Select value={showCustomCategory ? 'custom' : category} onValueChange={val => {
                if (val === 'custom') {
                  setShowCustomCategory(true)
                  setCategory('Other')
                } else {
                  setShowCustomCategory(false)
                  setCategory(val as TemplateCategory)
                }
              }}>
                <SelectTrigger className="w-48 focus:ring-2 focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="custom">
                    <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> New Category</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {showCustomCategory && (
                <Input
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="w-40 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Template Preview</Label>
            <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
              <div><strong>Topic:</strong> {mainTopic}</div>
              <div><strong>Audience:</strong> {audience}</div>
              <div><strong>Purpose:</strong> {purpose}</div>
              <div><strong>Category:</strong> {showCustomCategory && customCategory ? customCategory : category}</div>
              {keyPoints.length > 0 && (
                <div>
                  <strong>Key Points:</strong> {keyPoints.join(', ')}
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-800 font-medium">Template saved successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
              className="hover:scale-105 transition-transform"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="gap-2 hover:scale-105 transition-transform hover:shadow-md"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Save className="h-4 w-4" />
                  </motion.div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 