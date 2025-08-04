'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Star } from "lucide-react"
import { AnimatedWords } from "@/components/shared/AnimatedWords"
import { Suspense } from "react"

export function HeroSection() {
  const contentTypes = ["TikToks", "Reels", "Carousels", "Stories", "Posts"]

  return (
    <section className="w-full min-h-screen flex items-center justify-center gradient-bg-daylight">
      <div className="w-full px-4 md:px-8 xl:px-12 2xl:px-16">
        <div className="w-full min-h-[90vh] py-8 md:py-16 flex flex-col items-center justify-center text-center">
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="block text-gray-50 drop-shadow-lg">
              Create Engaging
            </span>
            
            <span className="block text-6xl md:text-8xl font-extrabold my-2">
              <Suspense fallback={<span className="text-gradient-animated">Content</span>}>
                <AnimatedWords
                  words={contentTypes}
                  className="text-gradient-animated drop-shadow-lg"
                />
              </Suspense>
            </span>

            <span className="block mt-4 text-2xl md:text-4xl font-medium text-gray-50">
              Effortlessly with AI
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl text-center text-gray-100 mb-8">
            Turn your ideas into stunning social media content for any platform.
            <br />
            AI-powered, fast, and ready to publish.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/carousel">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-none"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/#features">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-gray-300/60 text-gray-100 hover:bg-white/15 hover:border-gray-200/80 hover:text-white transition-all duration-300"
              >
                <span>How It Works</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-200">
            <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
              <Users className="h-5 w-5" />
              <span className="text-lg font-medium">10,000+ creators</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
              <Star className="h-5 w-5 text-amber-300 fill-current" />
              <span className="text-lg font-medium">4.9/5 satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 