'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-44 min-h-[69vh] flex items-center w-full">
      <div className="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-foreground leading-tight hover:grow-text transition-transform duration-400 ease-out">
            <span className="bg-gradient-to-tr from-red-800 via-red-600 to-rose-500 bg-clip-text text-transparent">Create Instagram Carousels</span> <br />
            <span className="bg-gradient-to-tr from-red-800 via-red-600 to-rose-500 bg-clip-text text-transparent">Effortlessly with AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed hover:grow-text transition-transform duration-400 ease-out">
            Enter your prompt, choose the number of images, and generate your carousel with AI in seconds. Download and share instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/carousel">
              <Button size="lg" className="text-lg px-8 py-6 btn-micro-effect bg-accent text-foreground hover:bg-accent/80 hover:grow-text transition-transform duration-400 ease-out">
                <span className="bg-gradient-to-tr from-red-800 via-red-600 to-rose-500 bg-clip-text text-transparent font-bold">Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 btn-micro-effect hover:grow-text transition-transform duration-400 ease-out">
                <span className="hover:grow-text transition-transform duration-400 ease-out">How It Works</span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
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