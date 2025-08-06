'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import AOS from "aos"
import { Section } from "@/components/shared/page-container"

export function CTASection() {
  useEffect(() => { AOS.init({ once: true, duration: 700 }) }, [])
  return (
    <Section 
      className="py-20 border-b border-white/10" 
      gradient="none"
      containerClassName="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto" 
      center={true}
    >
      <div className="rounded-2xl bg-white/8 backdrop-blur-md shadow-xl p-10 text-center border border-white/15 hover:border-white/25 transition-all duration-300 mx-auto max-w-3xl" data-aos="zoom-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-50">
          Ready to elevate your social media?
        </h2>
        <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
          Start your free trial today and experience the difference. 
          Join thousands of creators who are already growing their audience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/sign-up">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-none"
            >
              <span className="font-bold">Get Started Free</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6 border-gray-300/60 text-gray-100 hover:bg-white/15 hover:border-gray-200/80 hover:text-white transition-all duration-300"
          >
            <span className="font-bold">Schedule Demo</span>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-200">
          <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
            <Check className="h-5 w-5 text-emerald-300" />
            <span className="text-sm">No credit card required</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
            <Check className="h-5 w-5 text-emerald-300" />
            <span className="text-sm">14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-white transition-colors duration-300">
            <Check className="h-5 w-5 text-emerald-300" />
            <span className="text-sm">Cancel anytime</span>
          </div>
        </div>
      </div>
    </Section>
  )
} 