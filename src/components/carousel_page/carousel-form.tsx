'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Image, Palette, Camera, Brush, PenTool, Aperture, Sun, Cloud, Zap } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

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
    example: "Generate a carousel explaining how to create engaging Instagram carousels. Each slide should cover one step, with a clear title and a practical tip. Tone: educational and supportive. Target audience: small business owners and content creators."
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
const KEYPOINT_SUGGESTIONS = [
  "Social media",
  "Content strategy",
  "Analytics",
  "Branding",
  "Engagement",
  "SEO",
  "Time management",
  "Growth mindset",
]

// Chip renkleri (soft pastel tonlar, Tailwind)
const CHIP_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-slate-200 text-slate-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
]

export function CarouselForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [prompt, setPrompt] = useState("")
  const [imageCount, setImageCount] = useState(5)
  const [styles, setStyles] = useState<string[]>([STYLES[0].value])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, isLoaded } = useUser()

  // Prompt mode: classic or structured
  const [promptMode, setPromptMode] = useState<'classic' | 'structured'>('classic')

  // Structured prompt fields
  const [mainTopic, setMainTopic] = useState("")
  const [audience, setAudience] = useState("")
  const [purpose, setPurpose] = useState("")
  const [points, setPoints] = useState<string[]>([])
  const [pointInput, setPointInput] = useState("")

  // Kullanıcı yüklenene kadar loading göster
  if (!isLoaded) {
    return (
      <Card className="w-full bg-background border-border">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  // Kullanıcı giriş yapmamışsa sign-in sayfasına yönlendir
  if (!user) {
    router.push('/sign-in')
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
        {/* Prompt Mode Switcher */}
        <div className="mb-6 flex flex-col items-center">
          <div className="inline-flex rounded-lg bg-[var(--muted)] p-1 shadow-sm border border-[var(--border)]">
            <button
              type="button"
              className={`px-5 py-2 rounded-md font-semibold text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${promptMode === 'classic'
                  ? 'bg-primary text-primary-foreground shadow'
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
              className={`px-5 py-2 rounded-md font-semibold text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${promptMode === 'structured'
                  ? 'bg-primary text-primary-foreground shadow'
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
                      key={tpl.label}
                      onClick={() => setPrompt(tpl.example)}
                      className={`px-3 py-1 rounded-full border border-transparent text-xs md:text-sm font-medium transition-colors shadow-sm
                        ${CHIP_COLORS[i % CHIP_COLORS.length]}
                        hover:border-primary hover:text-primary hover:bg-primary/10
                        ${prompt === tpl.example ? 'border-primary bg-primary/10 text-primary' : ''}
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
                  className="w-full max-w-2xl mx-auto min-h-[160px] md:min-h-[200px] bg-[var(--muted)] border-2 border-[var(--border)] text-lg md:text-xl text-foreground placeholder:text-muted-foreground rounded-xl px-5 py-4 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
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
              <div className="space-y-2">
                <Label htmlFor="mainTopic" className="text-foreground font-semibold">Main Topic</Label>
                <Input
                  id="mainTopic"
                  placeholder="e.g. Digital marketing trends"
                  value={mainTopic}
                  onChange={e => setMainTopic(e.target.value)}
                  required={promptMode === 'structured'}
                  className="w-full max-w-2xl mx-auto text-lg bg-[var(--muted)] border-2 border-[var(--border)] text-foreground placeholder:text-muted-foreground rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {TOPIC_SUGGESTIONS.map((topic, i) => (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => setMainTopic(topic)}
                      className={`px-3 py-1 rounded-full border border-transparent text-xs font-medium transition-colors shadow-sm
                        ${CHIP_COLORS[i % CHIP_COLORS.length]}
                        hover:border-primary hover:text-primary hover:bg-primary/10
                        ${mainTopic === topic ? 'border-primary bg-primary/10 text-primary' : ''}
                      `}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
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
                  className="w-full max-w-2xl mx-auto text-lg bg-[var(--muted)] border-2 border-[var(--border)] text-foreground placeholder:text-muted-foreground rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {AUDIENCE_SUGGESTIONS.map((aud, i) => (
                    <button
                      type="button"
                      key={aud}
                      onClick={() => setAudience(aud)}
                      className={`px-3 py-1 rounded-full border border-transparent text-xs font-medium transition-colors shadow-sm
                        ${CHIP_COLORS[i % CHIP_COLORS.length]}
                        hover:border-primary hover:text-primary hover:bg-primary/10
                        ${audience === aud ? 'border-primary bg-primary/10 text-primary' : ''}
                      `}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Who is this content for?</div>
              </div>
          <div className="space-y-2">
                <Label htmlFor="purpose" className="text-foreground font-semibold">Purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className="w-full max-w-2xl mx-auto text-lg bg-[var(--muted)] border-2 border-[var(--border)] text-foreground rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all">
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
              <div className="space-y-2">
                <Label htmlFor="points" className="text-foreground font-semibold">Key Points to Cover <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <div className="flex gap-2">
                  <Input
                    id="points"
                    placeholder="e.g. Social media, Content strategy, Analytics"
                    value={pointInput}
                    onChange={e => setPointInput(e.target.value)}
                    className="flex-1 text-lg bg-[var(--muted)] border-2 border-[var(--border)] text-foreground placeholder:text-muted-foreground rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && pointInput.trim()) {
                        e.preventDefault()
                        if (!points.includes(pointInput.trim())) {
                          setPoints([...points, pointInput.trim()])
                        }
                        setPointInput("")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (pointInput.trim() && !points.includes(pointInput.trim())) {
                        setPoints([...points, pointInput.trim()])
                        setPointInput("")
                      }
                    }}
                  >Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {points.map((pt, idx) => (
                    <span key={pt} className="flex items-center bg-primary/10 text-primary border border-primary px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {pt}
                      <button type="button" className="ml-1" onClick={() => setPoints(points.filter((_, i) => i !== idx))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {KEYPOINT_SUGGESTIONS.filter(s => !points.includes(s)).map((s, i) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setPoints([...points, s])}
                      className={`px-3 py-1 rounded-full border border-transparent text-xs font-medium transition-colors shadow-sm
                        ${CHIP_COLORS[i % CHIP_COLORS.length]}
                        hover:border-primary hover:text-primary hover:bg-primary/10
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Add important keywords or topics (press Enter, comma, or click a suggestion).</div>
          </div>
            </div>
          )}

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

          {/* Style Chips */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Image Styles</Label>
            <div className="flex flex-wrap gap-2 mt-1 justify-center">
              {STYLES.map((s, i) => {
                const selected = styles.includes(s.value)
                return (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => handleStyleToggle(s.value)}
                    className={`flex items-center px-3 py-1 rounded-full border border-transparent text-sm font-medium transition-colors shadow-sm
                      ${CHIP_COLORS[i % CHIP_COLORS.length]}
                      hover:border-primary hover:text-primary hover:bg-primary/10
                      ${selected ? 'border-primary bg-primary/10 text-primary' : ''}
                    `}
                  >
                    {s.icon}
                    {s.label}
                    {selected && <span className="ml-1">✓</span>}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">You can select multiple styles.</p>
          </div>

          {/* Submit Button */}
          <Button
            variant="default"
            type="submit"
            disabled={loading || (promptMode === 'classic' ? !prompt.trim() : !mainTopic.trim() || !audience.trim() || !purpose.trim())}
            className="w-full text-lg py-6 font-bold flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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