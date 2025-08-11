'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Star } from "lucide-react"
import { AnimatedWords } from "@/components/shared/AnimatedWords"
import { Suspense } from "react"
import { motion } from "framer-motion"
import { useMouseBeam } from "@/lib/hooks/useMouseBeam"

export function HeroSection() {
  const contentTypes = ["TikToks", "Reels", "Carousels", "Stories", "Posts"]
  const { containerRef, handleMouseMove, handleMouseLeave } = useMouseBeam({ resetOnLeave: false })

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background overlays moved to global BackgroundOverlay */}
      <div className="relative w-full px-4 md:px-8 xl:px-12 2xl:px-16">
        <div className="w-full min-h-[90vh] py-8 md:py-16 flex flex-col items-center justify-center text-center">
          
          <h1 className="hero-spotlight text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
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

          <motion.p
            className="text-lg md:text-xl max-w-2xl text-center text-gray-100 mb-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            Turn your ideas into stunning social media content for any platform.
            <br />
            AI-powered, fast, and ready to publish.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/carousel">
              <motion.button
                className="text-lg px-8 py-4 md:py-6 rounded-md bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 text-white font-bold shadow-lg border-none"
                whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(56,189,248,.35)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
            <Link href="/#features">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-white/30 text-gray-100 hover:bg-white/15 hover:border-white/50 hover:text-white transition-all duration-300"
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