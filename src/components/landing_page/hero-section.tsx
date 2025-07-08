'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Star } from "lucide-react"
import { AnimatedGradientText } from "@/components/shared/AnimatedGradientText"
import { AnimatedWords } from "@/components/shared/AnimatedWords"

export function HeroSection() {
  return (
    <section className="w-full min-h-[100vh] flex items-center justify-center bg-[var(--background)]">
      <div className="w-full px-4 md:px-8 xl:px-12 2xl:px-16">
        <div className="w-full min-h-[90vh] bg-[var(--card)]/90 backdrop-blur-md rounded-2xl shadow-2xl py-8 md:py-16 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-center">
            <span className="block heading-gradient heading text-[var(--heading-foreground)] drop-shadow-lg">
              Create Instagram
            </span>
            <span className="block text-6xl md:text-8xl font-extrabold my-2">
              <AnimatedWords
                words={["Carousels", "Stories", "Posts"]}
                gradients={[
                  "bg-gradient-to-r from-[#f58529] via-[#dd2a7b] via-[#8134af] to-[#515bd4]",
                  "bg-gradient-to-r from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5]",
                  "bg-gradient-to-r from-[#4f5bd5] via-[#962fbf] via-[#d62976] to-[#fa7e1e]"
                ]}
                className="bg-clip-text text-transparent drop-shadow-lg"
              />
            </span>
            <span className="block mt-4 text-2xl md:text-4xl font-medium text-[var(--muted)]">
              Effortlessly with AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-center text-[var(--heading-foreground)] mb-8">
            Enter your prompt, choose the number of images, and generate your carousel with AI in seconds.<br />
            Download and share instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/carousel">
              <Button size="lg" className="text-lg px-8 py-6 btn-micro-effect bg-[var(--accent)] text-[var(--foreground)] hover:bg-[var(--accent)]/80 hover:grow-text transition-transform duration-400 ease-out">
                <span className="bg-gradient-to-tr from-[var(--heading-gradient-from)] via-[var(--heading-gradient-via)] to-[var(--heading-gradient-to)] bg-clip-text text-transparent font-bold">Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 btn-micro-effect hover:grow-text transition-transform duration-400 ease-out">
                <span className="hover:grow-text transition-transform duration-400 ease-out">How It Works</span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[var(--muted)]">
            <div className="flex items-center space-x-2 hover:grow-text transition-transform duration-400 ease-out">
              <Users className="h-5 w-5" />
              <span className="text-lg font-medium hover:grow-text transition-transform duration-400 ease-out">10,000+ creators</span>
            </div>
            <div className="flex items-center space-x-2 hover:grow-text transition-transform duration-400 ease-out">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-lg font-medium hover:grow-text transition-transform duration-400 ease-out">4.9/5 satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 