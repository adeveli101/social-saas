'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Image, Palette, Camera, Brush, PenTool, Aperture, Sun, Cloud, Zap, Save, BookOpen, RotateCcw, RefreshCw, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { AnimatedChip, AnimatedChipGroup } from "@/components/ui/animated-chip"
import { TemplateSaveDialog } from "./template-save-dialog"
import { TemplateSelector } from "./template-selector"
import { CONTEXTUAL_SUGGESTIONS, UserTemplate } from "@/lib/carousel-suggestions"
import { motion, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '@/lib/theme-provider'

const STYLES = [
  { value: "photo", label: "Photo-realistic", icon: <Camera className="h-4 w-4 mr-1" /> },
  { value: "vector", label: "Minimalist Vector", icon: <Palette className="h-4 w-4 mr-1" /> },
  { value: "3d", label: "3D Characters", icon: <Sparkles className="h-4 w-4 mr-1" /> },
  { value: "artistic", label: "Artistic", icon: <Brush className="h-4 w-4 mr-1" /> },
  { value: "sketch", label: "Sketch", icon: <PenTool className="h-4 w-4 mr-1" /> },
  { value: "cinematic", label: "Cinematic", icon: <Aperture className="h-4 w-4 mr-1" /> },
  { value: "bright", label: "Bright", icon: <Sun className="h-4 w-4 mr-1" /> },
  { value: "cloudy", label: "Cloudy", icon: <Cloud className="h-4 w-4 mr-1" /> },
  { value: "vivid", label: "Vivid Colors", icon: <Zap className="h-4 w-4 mr-1" /> },
]

const TEMPLATES = [
  {
    label: "Weekly Tips",
    example: "Create a carousel with actionable productivity tips for remote workers. Each slide should have a catchy title, a short tip, and a one-sentence explanation. The tone should be friendly and motivating. Target audience: young professionals working from home."
  },
  {
    label: "Product Promotion",
    example: "Generate a carousel to promote our new eco-friendly water bottle. Start with a bold headline, highlight unique features (one per slide), include a customer testimonial, and end with a call-to-action. Tone: enthusiastic and persuasive. Target audience: health-conscious millennials."
  },
  {
    label: "Event Announcement",
    example: "Design a carousel announcing our annual community clean-up event. Include the event date, location, main activities, and a final slide with a call-to-action to join. Use a positive and inclusive tone. Target audience: local families and volunteers."
  },
  {
    label: "Listicle Content",
    example: "Create a carousel listing must-read books for aspiring entrepreneurs. Each slide should feature the book title, author, and a one-sentence reason why it's recommended. Tone: informative and inspiring. Target audience: young business enthusiasts."
  },
  {
    label: "Inspirational Story",
    example: "Write a carousel telling the story of how I turned my side hustle into a full-time business in one year. Each slide should cover a key milestone or lesson learned. Use a personal and encouraging tone. Target audience: aspiring entrepreneurs."
  },
  {
    label: "How-To Guide",
    example: "Generate a carousel explaining how to create engaging Instagram carousels. Each slide should cover one step, with a clear title, and a practical tip. Tone: educational and supportive. Target audience: small business owners and content creators."
  },
  {
    label: "Customer Testimonial",
    example: "Create a carousel featuring a customer testimonial. Start with a headline, then share the customer's challenge, how our platform helped, and the results they achieved. Tone: authentic and positive. Target audience: potential new users."
  },
  {
    label: "Behind the Scenes",
    example: "Design a carousel giving a behind-the-scenes look at our creative studio. Include team introductions, a typical workday, tools we use, and a fun fact. Tone: friendly and transparent. Target audience: creative professionals and clients."
  },
]

// Ready-made suggestions for structured prompt fields
const TOPIC_SUGGESTIONS = [
  "Digital marketing trends",
  "Healthy lifestyle tips",
  "Startup growth hacks",
  "Personal finance basics",
  "Remote work productivity",
  "Instagram content ideas",
  "Brand storytelling",
  "E-commerce strategies",
]
const AUDIENCE_SUGGESTIONS = [
  "Small business owners",
  "Freelancers",
  "Content creators",
  "Students",
  "Parents",
  "Entrepreneurs",
  "Marketing professionals",
  "Fitness enthusiasts",
]
// Key point group example
const KEYPOINT_GROUPS = [
  {
    groupName: 'E-commerce Suggestions',
    suggestions: [
      'Conversion', 'Retention', 'Shipping', 'Analytics', 'Inventory', 'Customer service'
    ]
  },
  {
    groupName: 'Health-themed Suggestions',
    suggestions: [
      'Exercise', 'Nutrition', 'Mental health', 'Sleep', 'Wellness', 'Habits'
    ]
  },
  {
    groupName: 'General Popular Topics',
    suggestions: [
      'Social media', 'Content strategy', 'Branding', 'Engagement', 'SEO', 'Time management', 'Growth mindset'
    ]
  }
]

// Chip colors (soft pastel tones, Tailwind), now theme-aware
const CHIP_COLORS_LIGHT = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-slate-200 text-slate-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
]
const CHIP_COLORS_DARK = [
  'bg-blue-900/50 text-blue-200 border border-blue-800',
  'bg-green-900/50 text-green-200 border border-green-800',
  'bg-purple-900/50 text-purple-200 border border-purple-800',
  'bg-yellow-900/50 text-yellow-200 border border-yellow-800',
  'bg-pink-900/50 text-pink-200 border border-pink-800',
  'bg-slate-800 text-slate-200 border border-slate-700',
  'bg-orange-900/50 text-orange-200 border border-orange-800',
  'bg-teal-900/50 text-teal-200 border border-teal-800',
]

// New className for Input, Textarea, and SelectTrigger, now theme-aware
const inputClass = "w-full max-w-2xl mx-auto text-lg bg-muted border-2 border-border text-foreground placeholder:text-muted-foreground rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
const selectTriggerClass = "w-full max-w-2xl mx-auto text-lg bg-muted border-2 border-border text-foreground rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

export function CarouselForm({ onSubmit, initialPrompt = "" }: { onSubmit: (data: any) => void, initialPrompt?: string }) {
  // All hooks at the top, unconditionally
  const [prompt, setPrompt] = useState(initialPrompt)
  const [imageCount, setImageCount] = useState(5)
  const [styles, setStyles] = useState<string[]>([STYLES[0].value])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { theme } = useTheme()
  const CHIP_COLORS = theme === 'dark' ? CHIP_COLORS_DARK : CHIP_COLORS_LIGHT
  
  const [promptMode, setPromptMode] = useState<'classic' | 'structured'>('classic')
  const [mainTopic, setMainTopic] = useState("")
  const [audience, setAudience] = useState("")
  const [purpose, setPurpose] = useState("")
  const [points, setPoints] = useState<string[]>([])
  const [pointInput, setPointInput] = useState("")
  const [dynamicAudienceSuggestions, setDynamicAudienceSuggestions] = useState<string[]>(AUDIENCE_SUGGESTIONS)
  const [dynamicKeyPointSuggestions, setDynamicKeyPointSuggestions] = useState<string[]>(KEYPOINT_GROUPS.flatMap(group => group.suggestions))
  const [removedPoints, setRemovedPoints] = useState<string[]>([])
  const [showDraftAlert, setShowDraftAlert] = useState(false)
  const draftRestored = useRef(false)
  const [lastLoadedTemplate, setLastLoadedTemplate] = useState<UserTemplate | null>(null)
  
  // Enhanced button states
  const [isResetting, setIsResetting] = useState(false)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [templateLoadSuccess, setTemplateLoadSuccess] = useState(false)
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false)

  // Accordion state for keypoint groups
  const [openKeyPointGroup, setOpenKeyPointGroup] = useState<string | null>(KEYPOINT_GROUPS[0]?.groupName || null)

  // Undo state for clearing the form
  const [lastClearedState, setLastClearedState] = useState<any>(null)
  const [showUndo, setShowUndo] = useState(false)
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Autosave structured prompt fields
  useEffect(() => {
    if (promptMode !== 'structured') return
    const draft = { mainTopic, audience, purpose, points }
    localStorage.setItem('carouselFormDraft', JSON.stringify(draft))
  }, [promptMode, mainTopic, audience, purpose, points])

  // On mount, check for draft
  useEffect(() => {
    if (promptMode !== 'structured') return
    if (draftRestored.current) return
    const draft = localStorage.getItem('carouselFormDraft')
    if (draft) {
      setShowDraftAlert(true)
    }
  }, [promptMode])

  // Restore draft with enhanced feedback
  const handleRestoreDraft = async () => {
    const draft = localStorage.getItem('carouselFormDraft')
    if (draft) {
      try {
        const { mainTopic: dMain, audience: dAud, purpose: dPur, points: dPts } = JSON.parse(draft)
        setMainTopic(dMain || '')
        setAudience(dAud || '')
        setPurpose(dPur || '')
        setPoints(Array.isArray(dPts) ? dPts : [])
        draftRestored.current = true
        
        // Success feedback
        setTemplateLoadSuccess(true)
        setTimeout(() => setTemplateLoadSuccess(false), 2000)
      } catch {}
    }
    setShowDraftAlert(false)
  }
  
  // Dismiss draft
  const handleDismissDraft = () => {
    localStorage.removeItem('carouselFormDraft')
    setShowDraftAlert(false)
  }
  
  // Clear draft on submit or reset
  const clearDraft = () => {
    localStorage.removeItem('carouselFormDraft')
  }

  // Update dynamic suggestions when the main topic changes
  useEffect(() => {
    if (mainTopic && CONTEXTUAL_SUGGESTIONS[mainTopic]) {
      setDynamicAudienceSuggestions(CONTEXTUAL_SUGGESTIONS[mainTopic].audience)
      setDynamicKeyPointSuggestions(CONTEXTUAL_SUGGESTIONS[mainTopic].keyPoints)
    } else {
      setDynamicAudienceSuggestions(AUDIENCE_SUGGESTIONS)
      setDynamicKeyPointSuggestions(KEYPOINT_GROUPS.flatMap(group => group.suggestions))
    }
  }, [mainTopic])

  // Enhanced template selection with loading and success feedback
  const handleTemplateSelect = async (template: UserTemplate) => {
    setIsLoadingTemplate(true)
    try {
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (promptMode === 'structured') {
        setMainTopic(template.mainTopic)
        setAudience(template.audience)
        setPurpose(template.purpose)
        setPoints(template.keyPoints)
        setLastLoadedTemplate(template)
      } else {
        // For classic mode, generate a descriptive prompt
        const classicPrompt = 
          `Create a carousel about "${template.mainTopic}" for ${template.audience}. ` +
          `The main purpose is to ${template.purpose.toLowerCase()}. ` +
          (template.keyPoints.length > 0 ? `It should cover these key points: ${template.keyPoints.join(', ')}. ` : '') +
          `The tone should be engaging and informative.`
        setPrompt(classicPrompt)
      }
      
      // Success feedback
      setTemplateLoadSuccess(true)
      setTimeout(() => setTemplateLoadSuccess(false), 2000)
    } catch (error) {
      console.error('Template loading error:', error)
    } finally {
      setIsLoadingTemplate(false)
    }
  }

  // Enhanced smart reset with loading and success feedback
  const handleSmartReset = async () => {
    if (!lastLoadedTemplate) return
    
    setIsResetting(true)
    try {
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 400))
      
      setMainTopic(lastLoadedTemplate.mainTopic)
      setAudience(lastLoadedTemplate.audience)
      setPurpose(lastLoadedTemplate.purpose)
      setPoints(lastLoadedTemplate.keyPoints)
      clearDraft()
      
      // Success feedback
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 2000)
    } catch (error) {
      console.error('Reset error:', error)
    } finally {
      setIsResetting(false)
    }
  }
  
  // Enhanced classic reset with loading, success feedback, and UNDO
  const handleClearAll = async () => {
    setIsResetting(true)
    
    // Store current state for undo functionality
    setLastClearedState({ mainTopic, audience, purpose, points })

    // Clear any existing undo timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }

    try {
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 400))
      
      setMainTopic("")
      setAudience("")
      setPurpose("")
      setPoints([])
      setRemovedPoints([])
      setLastLoadedTemplate(null)
      clearDraft()
      
      // Show undo button for 5 seconds
      setShowUndo(true)
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndo(false)
        setLastClearedState(null) // Clear undo data after timeout
      }, 5000)

    } catch (error) {
      console.error('Clear error:', error)
    } finally {
      setIsResetting(false)
    }
  }

  // Handle undo action
  const handleUndoClear = () => {
    if (lastClearedState) {
      setMainTopic(lastClearedState.mainTopic)
      setAudience(lastClearedState.audience)
      setPurpose(lastClearedState.purpose)
      setPoints(lastClearedState.points)
    }
    // Hide undo button and clear state
    setShowUndo(false)
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }
    setLastClearedState(null)
  }

  // Redirect to sign-in if user is not authenticated (after isLoaded)
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  // Early return for loading state
  if (!isLoaded) {
    return (
      <Card className="w-full bg-background border-border">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  // Early return for unauthenticated state (redirect will happen in useEffect)
  if (!user) {
    return null
  }

  const handleStyleToggle = (value: string) => {
    setStyles((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let finalPrompt = prompt
    if (promptMode === 'structured') {
      if (!mainTopic.trim() || !audience.trim() || !purpose.trim()) return
      finalPrompt =
        `Main topic: ${mainTopic.trim()}\n` +
        `Target audience: ${audience.trim()}\n` +
        `Purpose: ${purpose}\n` +
        (points.length > 0 ? `Key points to cover: ${points.join(", ")}\n` : "") +
        `Write a detailed, engaging Instagram carousel in English based on these instructions.`
      clearDraft()
    }
    if (promptMode === 'classic' && !prompt.trim()) return
    setLoading(true)
    onSubmit({ prompt: finalPrompt, imageCount, styles })
  }

  return (
    <Card className="w-full bg-[var(--card)] border-[var(--border)] max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center mb-2">Describe Your Carousel</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your topic, choose the number of slides and style(s). We'll create your Instagram carousel with AI magic!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Enhanced draft restore alert */}
        {showDraftAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-900 border border-yellow-300 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">You have a draft carousel. Would you like to continue from where you left off?</span>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button 
                size="sm" 
                variant="default" 
                onClick={handleRestoreDraft}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <CheckCircle className="h-4 w-4" />
                Continue
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDismissDraft}
                className="hover:scale-105 transition-transform"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Success feedback alerts */}
        <AnimatePresence>
          {showUndo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground border border-border flex items-center justify-between gap-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Form cleared.</span>
              </div>
              <Button 
                variant="link" 
                className="text-primary p-0 h-auto font-semibold hover:underline"
                onClick={handleUndoClear}
              >
                Undo
              </Button>
            </motion.div>
          )}

          {resetSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-green-50 text-green-900 border border-green-300 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Form reset successfully!</span>
            </motion.div>
          )}
          
          {templateLoadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-300 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Template loaded successfully!</span>
            </motion.div>
          )}
          
          {templateSaveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-green-50 text-green-900 border border-green-300 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Template saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt Mode Switcher */}
        <div className="mb-6 flex flex-col items-center">
          <div className="inline-flex rounded-lg bg-[var(--muted)] p-1 shadow-sm border border-[var(--border)]">
            <button
              type="button"
              className={`px-5 py-2 rounded-md font-semibold text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:scale-105
                ${promptMode === 'classic'
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-transparent text-foreground hover:bg-primary/10'}
              `}
              onClick={() => setPromptMode('classic')}
              tabIndex={0}
              aria-pressed={promptMode === 'classic'}
            >
              Classic Prompt
            </button>
            <button
              type="button"
              className={`px-5 py-2 rounded-md font-semibold text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:scale-105
                ${promptMode === 'structured'
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-transparent text-foreground hover:bg-primary/10'}
              `}
              onClick={() => setPromptMode('structured')}
              tabIndex={0}
              aria-pressed={promptMode === 'structured'}
            >
              Structured Prompt
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {promptMode === 'classic'
              ? 'Write your prompt in a single box, or use a template.'
              : 'Fill in the guided fields for a perfect AI prompt.'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Template Selector and Save Buttons */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <TemplateSelector 
              onTemplateSelect={handleTemplateSelect} 
              isLoading={isLoadingTemplate}
            />
            {promptMode === 'structured' && mainTopic && audience && purpose && (
              <TemplateSaveDialog
                mainTopic={mainTopic}
                audience={audience}
                purpose={purpose}
                keyPoints={points}
                onTemplateSaved={(template) => {
                  setTemplateSaveSuccess(true)
                  setTimeout(() => setTemplateSaveSuccess(false), 2000)
                }}
                trigger={
                  <Button 
                    variant="default" // Changed from outline
                    size="sm" 
                    className="gap-2 hover:scale-105 transition-transform hover:shadow-md"
                    disabled={isSavingTemplate}
                  >
                    {isSavingTemplate ? (
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
                }
              />
            )}
            {/* Enhanced Smart/Classic Reset Button */}
            {promptMode === 'structured' && (
              lastLoadedTemplate ? (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  className="gap-2 hover:scale-105 transition-transform hover:shadow-md"
                  onClick={handleSmartReset}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </motion.div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Reset Template
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="ghost" // Changed from outline
                  size="sm" 
                  className="gap-2 hover:scale-105 transition-transform hover:shadow-md text-muted-foreground"
                  onClick={handleClearAll}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                      Clearing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Clear All
                    </>
                  )}
                </Button>
              )
            )}
          </div>
          
          <hr className="border-border/50" />

          {/* Classic Prompt Mode */}
          {promptMode === 'classic' && (
            <>
              {/* Template Library */}
              <div className="mb-4">
                <div className="font-semibold text-sm text-foreground mb-2">Choose a Template</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {TEMPLATES.map((tpl, i) => (
                    <button
                      type="button"
                      key={tpl.label + '-' + i}
                      onClick={() => setPrompt(tpl.example)}
                      className={`px-3 py-1 rounded-full border border-transparent text-xs md:text-sm font-medium transition-all duration-200 shadow-sm hover:scale-105 hover:shadow-md
                        ${CHIP_COLORS[i % CHIP_COLORS.length]}
                        hover:border-primary hover:text-primary hover:bg-primary/10
                        ${prompt === tpl.example ? 'border-primary bg-primary/10 text-primary shadow-md scale-105' : ''}
                      `}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Prompt */}
          <div className="space-y-2">
                <Label htmlFor="prompt" className="text-foreground font-semibold">Topic / Prompt</Label>
            <Textarea
              id="prompt"
                  placeholder="e.g. '5 productivity tips for entrepreneurs' or 'Beginner's guide to houseplants'"
              value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  required={promptMode === 'classic'}
                  className={inputClass + ' min-h-[160px] md:min-h-[200px]'}
                />
                <div className="mt-1 text-sm md:text-base text-primary font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Tip: Be as detailed as possible! Mention the topic, audience, and tone (fun, professional, etc.) for best results.
                </div>
          </div>
            </>
          )}

          {/* Structured Prompt Mode */}
          {promptMode === 'structured' && (
            <div className="space-y-6">
              {/* --- Section 1: Content Foundation --- */}
              <div className="space-y-2">
                <Label htmlFor="mainTopic" className="text-foreground font-semibold">Main Topic</Label>
                <Input
                  id="mainTopic"
                  placeholder="e.g. Digital marketing trends"
                  value={mainTopic}
                  onChange={e => setMainTopic(e.target.value)}
                  required={promptMode === 'structured'}
                  className={inputClass}
                />
                <AnimatedChipGroup
                  chips={TOPIC_SUGGESTIONS.map((topic, index) => ({
                    id: topic,
                    label: topic,
                    selected: mainTopic === topic,
                    className: `${CHIP_COLORS[index % CHIP_COLORS.length]} hover:border-primary/50`,
                  }))}
                  onChipClick={(id) => setMainTopic(id)}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground">What is the main subject of your carousel?</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-foreground font-semibold">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g. Small business owners"
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  required={promptMode === 'structured'}
                  className={inputClass}
                />
                <AnimatedChipGroup
                  chips={dynamicAudienceSuggestions.map((aud, index) => ({
                    id: aud,
                    label: aud,
                    selected: audience === aud,
                    className: `${CHIP_COLORS[index % CHIP_COLORS.length]} hover:border-primary/50`,
                  }))}
                  onChipClick={(id) => setAudience(id)}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground">Who is this content for?</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-foreground font-semibold">Purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Educate">Educate <span className="text-xs text-muted-foreground">(Teach, inform, or explain a topic)</span></SelectItem>
                    <SelectItem value="Sell">Sell <span className="text-xs text-muted-foreground">(Promote a product or service)</span></SelectItem>
                    <SelectItem value="Inspire">Inspire <span className="text-xs text-muted-foreground">(Motivate or encourage your audience)</span></SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">What is the main goal? (Educate, Sell, Inspire)</div>
              </div>

              <hr className="border-border/50" />

              {/* --- Section 2: Details and Structure --- */}
              {/* Key Points to Cover field */}
              <div className="space-y-2">
                <Label htmlFor="points" className="text-foreground font-semibold">Key Points to Cover <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <div className="text-xs text-muted-foreground mb-1">Each keyword, slide idea, or important topic must be covered in your carousel. You can add back removed keywords from below.</div>
                <div className="flex gap-2">
                  <Input
                    id="points"
                    placeholder="e.g. Social media, Content strategy, Analytics"
                    value={pointInput}
                    onChange={e => setPointInput(e.target.value)}
                    className={inputClass}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && pointInput.trim()) {
                        e.preventDefault();
                        if (!points.includes(pointInput.trim())) {
                          setPoints([...points, pointInput.trim()]);
                          setRemovedPoints(removedPoints.filter(r => r !== pointInput.trim()));
                        }
                        setPointInput("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (pointInput.trim() && !points.includes(pointInput.trim())) {
                        setPoints([...points, pointInput.trim()]);
                        setRemovedPoints(removedPoints.filter(r => r !== pointInput.trim()));
                        setPointInput("");
                      }
                    }}
                    disabled={!pointInput.trim()}
                  >Add</Button>
                </div>
                {/* Selected tags */}
                {points.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    <AnimatePresence>
                  {points.map((pt, idx) => (
                        <motion.span
                          key={pt + '-' + idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center bg-primary/10 text-primary border border-primary px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                        >
                      {pt}
                          <button type="button" className="ml-1" onClick={() => {
                            setRemovedPoints([...removedPoints, pt]);
                            setPoints(points.filter((_, i) => i !== idx));
                          }}>
                        <X className="h-3 w-3" />
                      </button>
                        </motion.span>
                  ))}
                    </AnimatePresence>
                  </div>
                )}
                {/* Grouped suggestions - Accordion */}
                <div className="space-y-2 mt-2">
                    {KEYPOINT_GROUPS.map((group, groupIdx) => {
                      const groupSuggestions = group.suggestions.filter(s => !points.includes(s) && !removedPoints.includes(s));
                      if (groupSuggestions.length === 0) return null;
                      const isGroupOpen = openKeyPointGroup === group.groupName;
                      return (
                        <div key={group.groupName + '-' + groupIdx} className="border border-border rounded-lg overflow-hidden">
                          <button
                            type="button"
                            className="w-full flex justify-between items-center p-3 font-semibold text-sm text-foreground bg-muted/50"
                            onClick={() => setOpenKeyPointGroup(isGroupOpen ? null : group.groupName)}
                          >
                            <span>{group.groupName}</span>
                            <motion.div animate={{ rotate: isGroupOpen ? 180 : 0 }}>
                              <ChevronDown className="h-4 w-4" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {isGroupOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 flex flex-wrap gap-2">
                                  {groupSuggestions.map((s, i) => (
                                    <motion.button
                                      type="button"
                                      key={group.groupName + '-' + s + '-' + i}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.18, delay: i * 0.03 }}
                                      onClick={() => {
                                        setPoints([...points, s]);
                                        setRemovedPoints(removedPoints.filter(r => r !== s));
                                      }}
                                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:scale-105 hover:shadow-md ${CHIP_COLORS[(i + groupIdx * 3) % CHIP_COLORS.length]} hover:border-primary/50`}
                                    >
                                      {s}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                </div>
                {/* Removed items */}
                {removedPoints.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Removed (click to add back):</div>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {removedPoints.map((pt, i) => (
                          <motion.div
                            key={pt + '-removed-' + i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.18, delay: i * 0.03 }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setPoints([...points, pt]);
                                setRemovedPoints(removedPoints.filter(r => r !== pt));
                              }}
                              className="px-3 py-1 rounded-full border border-dashed text-xs font-medium bg-slate-200 text-slate-800"
                            >
                              {pt} <span className='ml-1'>↩️</span>
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">Add important keywords or topics (press Enter, comma, click a suggestion or Add button).</div>
              </div>
               {/* Image Count Slider */}
              <div className="space-y-2">
                <Label htmlFor="imageCount" className="text-foreground font-semibold">Number of Slides: <span className="font-bold text-primary">{imageCount}</span></Label>
                <input
                  id="imageCount"
                  type="range"
                  min={2}
                  max={10}
                  value={imageCount}
                  onChange={e => setImageCount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          )}

          <hr className="border-border/50" />

          {/* --- Section 3: Visual Style --- */}
          {/* Style Chips */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Image Styles</Label>
            <AnimatedChipGroup
              chips={STYLES.map((s) => ({
                id: s.value,
                label: s.label,
                selected: styles.includes(s.value),
                icon: s.icon
              }))}
              onChipClick={(id) => handleStyleToggle(id)}
              className="mt-1 justify-center"
            />
            <p className="text-xs text-muted-foreground">You can select multiple styles.</p>
          </div>

          {/* Enhanced Submit Button */}
          <Button
            variant="default"
            type="submit"
            disabled={loading || (promptMode === 'classic' ? !prompt.trim() : !mainTopic.trim() || !audience.trim() || !purpose.trim())}
            className="w-full text-lg py-6 font-bold flex items-center justify-center hover:scale-105 transition-transform hover:shadow-lg bg-primary text-primary-foreground"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="mr-2 h-5 w-5" />
                </motion.div>
                Creating Carousel...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Carousel
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 