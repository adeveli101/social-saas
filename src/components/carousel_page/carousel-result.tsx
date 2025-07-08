import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, ArrowLeft, ArrowRight, Info } from "lucide-react"

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

  // Tüm görselleri zip olarak indirme (placeholder, gerçek zip için ek kütüphane gerekir)
  const handleDownloadAll = () => {
    slides.forEach((slide: any, i: number) => handleDownload(slide.imageUrl, `slide-${i + 1}.jpg`))
  }

  // Tüm caption'ı kopyala
  const handleCopyAll = () => handleCopy(result.caption)

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Genel aksiyonlar */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <Button onClick={handleDownloadAll} variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download All</Button>
        <Button onClick={handleCopyAll} variant="outline" size="sm"><Copy className="h-4 w-4 mr-1" />Copy All Captions</Button>
        <Button onClick={onRestart} variant="ghost" size="sm">Start Over</Button>
      </div>

      {/* Galeri */}
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
        {/* Caption ve aksiyonlar */}
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="bg-[var(--muted)] rounded p-3 w-full text-sm text-foreground flex items-center justify-between">
            <span className="truncate mr-2">{slides[current]?.caption || ""}</span>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(slides[current]?.caption)}><Copy className="h-4 w-4" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload(slides[current].imageUrl, `slide-${current + 1}.jpg`)}><Download className="h-4 w-4 mr-1" />Download</Button>
        </div>
        {copied && <div className="text-green-600 text-xs mt-2">Copied!</div>}
      </div>

      {/* Nasıl paylaşılır rehberi */}
      <details className="mt-4 bg-[var(--muted)] border border-[var(--border)] rounded p-4">
        <summary className="flex items-center gap-2 cursor-pointer font-semibold"><Info className="h-4 w-4" />How to share?</summary>
        <ol className="list-decimal ml-6 mt-2 text-sm text-muted-foreground space-y-1">
          <li>Download all images to your device.</li>
          <li>Open Instagram, create a new post, and select all images in order.</li>
          <li>Paste the copied caption into the caption field.</li>
          <li>Share your carousel!</li>
        </ol>
      </details>
    </div>
  )
} 