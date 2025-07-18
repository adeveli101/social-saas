"use client"
import { useState, useRef } from "react"
import { CarouselForm } from "@/components/carousel_page/carousel-form"
import { GenerationProgress } from "@/components/carousel_page/generation-progress"
import { CarouselResult } from "@/components/carousel_page/carousel-result"
import { PageContainer } from "@/components/shared/page-container"
import { useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export function CarouselClientPage() {
  const [stage, setStage] = useState("form")
  const [formData, setFormData] = useState(null)
  const [progress, setProgress] = useState({ percent: 0, message: "" })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""

  const { user } = useUser()

  // Form submit handler
  const handleFormSubmit = async (data: any) => {
    setFormData(data)
    setStage("generating")
    setProgress({ percent: 5, message: "Starting up..." })
    setError(null)
    try {
      // 1. Carousel creation request
      const res = await fetch("/api/carousel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to start generation.")
      const { id } = await res.json()
      // 2. Start polling
      pollStatus(id)
    } catch (err: any) {
      setError(err.message || "Unexpected error.")
      setStage("form")
    }
  }

  // Polling function
  const pollStatus = (id: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/carousel/${id}`)
        if (!res.ok) throw new Error("Failed to fetch status.")
        const data = await res.json()
        // status: pending | completed | failed
        if (data.status === "completed") {
          setResult(data)
          setStage("result")
          clearInterval(pollingRef.current!)
        } else if (data.status === "failed") {
          setError(data.error_message || "Generation failed.")
          setStage("form")
          clearInterval(pollingRef.current!)
        } else {
          // pending
          setProgress({
            percent: data.progress || 30,
            message: data.message || "Generating..."
          })
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error.")
        setStage("form")
        clearInterval(pollingRef.current!)
      }
    }, 3500)
  }

  return (
    <PageContainer>
      <main className="w-full max-w-4xl px-4 md:px-8 mx-auto py-16">
        <div className="w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 heading-gradient">
              AI-Powered Content Creator
            </h1>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Create engaging social media posts with AI. Just enter your topic, and we'll handle the rest.
            </p>
          </div>
          {stage === "form" && (
            <CarouselForm onSubmit={handleFormSubmit} initialPrompt={initialPrompt} />
          )}
          {stage === "generating" && (
            <GenerationProgress progress={progress} />
          )}
          {stage === "result" && result && (
            <CarouselResult result={result} onRestart={() => setStage("form")} />
          )}
          {error && <div className="p-4 bg-red-100 text-red-700 rounded mt-4">{error}</div>}
        </div>
      </main>
    </PageContainer>
  )
} 