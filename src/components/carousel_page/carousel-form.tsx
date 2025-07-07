'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"

export function CarouselForm() {
  const [prompt, setPrompt] = useState('')
  const [imageCount, setImageCount] = useState('3')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, isLoaded } = useUser()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/carousel/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          imageCount: parseInt(imageCount),
          userId: user.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Bir hata oluştu')
      }

      const data = await response.json()
      router.push(`/carousel/preview/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Create Carousel
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Describe your topic and select image count, we'll create your Instagram carousel with AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-foreground">Topic / Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Example: '5 tips for entrepreneurs' or 'Healthy lifestyle habits'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground">
              Describe your carousel topic in detail.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageCount" className="text-foreground">Number of Images</Label>
            <Select value={imageCount} onValueChange={setImageCount}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select number of images" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} images
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose between 3-10 images for Instagram carousel.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button variant="default" type="submit" disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Carousel...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Carousel
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 