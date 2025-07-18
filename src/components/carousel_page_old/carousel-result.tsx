import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, ArrowLeft, ArrowRight, Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function CarouselResult({ result, onRestart }: { result: any, onRestart: () => void }) {
  const [current, setCurrent] = useState(0)
  const [copied, setCopied] = useState(false)
  const slides = result?.slides || []

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  // Download all images as a zip (placeholder, requires external library for actual zip)
  const handleDownloadAll = () => {
    slides.forEach((slide: any, i: number) => handleDownload(slide.imageUrl, `slide-${i + 1}.jpg`))
  }

  // Copy all captions
  const handleCopyAll = () => handleCopy(result.caption)

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Content is Ready!</CardTitle>
          <CardDescription>Download your assets and post them to your favorite social media platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How to Use:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Click "Download All" to get a ZIP file with your images and captions.</li>
                <li>Extract the ZIP file on your device.</li>
                <li>Open your preferred social media app (e.g., Instagram, LinkedIn, Facebook).</li>
                <li>Create a new post and upload the images in the correct order.</li>
                <li>Copy the generated caption and paste it into your post.</li>
                <li>Publish and watch the engagement roll in!</li>
              </ol>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDownloadAll} variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download All</Button>
              <Button onClick={handleCopyAll} variant="outline" size="sm"><Copy className="h-4 w-4 mr-1" />Copy All Captions</Button>
              <Button onClick={onRestart} variant="ghost" size="sm">Start Over</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}><ArrowLeft /></Button>
          <span className="text-sm text-muted-foreground">Slide {current + 1} / {slides.length}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))} disabled={current === slides.length - 1}><ArrowRight /></Button>
        </div>
        {slides.length > 0 && (
          <img
            src={slides[current].imageUrl}
            alt={`Slide ${current + 1}`}
            className="w-full max-w-xs aspect-square object-cover rounded-lg shadow mb-4"
            draggable={false}
          />
        )}
        {/* Caption and actions */}
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="bg-[var(--muted)] rounded p-3 w-full text-sm text-foreground flex items-center justify-between">
            <span className="truncate mr-2">{slides[current]?.caption || ""}</span>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(slides[current]?.caption)}><Copy className="h-4 w-4" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload(slides[current].imageUrl, `slide-${current + 1}.jpg`)}><Download className="h-4 w-4 mr-1" />Download</Button>
        </div>
        {copied && <div className="text-green-600 text-xs mt-2">Copied!</div>}
      </div>
    </div>
  )
} 