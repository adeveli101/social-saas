'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Copy, Check, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CarouselPreviewProps {
  carouselId: string
}

interface CarouselSlide {
  id: string
  carousel_id: string
  slide_number: number
  image_url: string | null
  caption: string | null
  created_at: string
}

interface CarouselData {
  id: string
  user_id: string
  prompt: string
  image_count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  final_caption: string | null
  error_message: string | null
  created_at: string
  updated_at: string
  slides: CarouselSlide[]
}

export function CarouselPreview({ carouselId }: CarouselPreviewProps) {
  const [carousel, setCarousel] = useState<CarouselData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const response = await fetch(`/api/carousel/${carouselId}`)
        if (!response.ok) {
          throw new Error('Carousel not found')
        }
        const data = await response.json()
        setCarousel(data)
        
        // If still pending or processing, check again after 5 seconds
        if (data.status === 'pending' || data.status === 'processing') {
          setTimeout(fetchCarousel, 5000)
        } else {
          setLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchCarousel()
  }, [carouselId])

  const copyCaption = async () => {
    if (carousel?.final_caption) {
      try {
        await navigator.clipboard.writeText(carousel.final_caption)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Clipboard copy failed:', err)
      }
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Carousel queued...'
      case 'processing':
        return 'AI creating images...'
      case 'completed':
        return 'Carousel ready!'
      case 'failed':
        return 'Error occurred'
      default:
        return 'Unknown status'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'processing':
        return 'bg-blue-500/20 text-blue-400'
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {carousel ? getStatusMessage(carousel.status) : 'Loading carousel...'}
          </h2>
          <p className="text-muted-foreground">
            {carousel?.status === 'processing' ? 'This process may take a few minutes.' : 'Please wait...'}
          </p>
          {carousel && (
            <Badge variant="secondary" className={getStatusColor(carousel.status)}>
              {carousel.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  if (error || carousel?.status === 'failed') {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-500/20 bg-red-500/10 bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              Error Occurred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300 mb-4">
              {carousel?.error_message || error || 'An error occurred while creating the carousel.'}
            </p>
            <Link href="/carousel">
              <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!carousel || carousel.status !== 'completed') {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Carousel Ready!</h1>
        <p className="text-muted-foreground mb-4">{carousel.prompt}</p>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          {carousel.slides.length} images created
        </Badge>
      </div>

      {/* Caption Section */}
              {carousel.final_caption && (
          <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Instagram Caption</span>
              <Button 
                onClick={copyCaption}
                variant="outline" 
                size="sm"
                className="border-green-500/20 text-green-400 hover:bg-green-500/10"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{carousel.final_caption}</p>
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carousel.slides.map((slide) => (
          <Card key={slide.id} className="overflow-hidden bg-background border-border">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={slide.image_url || ''}
                  alt={`Slide ${slide.slide_number}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {slide.slide_number}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <Button 
                  onClick={() => window.open(slide.image_url || '', '_blank')}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="border-blue-500/20 bg-blue-500/10 bg-background border-border">
        <CardHeader>
          <CardTitle className="text-blue-400">How to Share?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Download images in order (slide-1, slide-2, ...)</li>
            <li>Create new post on Instagram</li>
            <li>Select downloaded images in order</li>
            <li>Copy and paste the caption</li>
            <li>Share!</li>
          </ol>
        </CardContent>
      </Card>

      {/* Back to Create */}
      <div className="text-center">
        <Link href="/carousel">
          <Button variant="outline" className="border-border text-muted-foreground hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Create New Carousel
          </Button>
        </Link>
      </div>
    </div>
  )
} 