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
    <Section className="py-16" containerClassName="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto" center={true}>
      <div className="rounded-2xl bg-background/80 shadow-xl p-10 text-center border border-border hover:border-primary/20 transition-all duration-300 mx-auto max-w-2xl" data-aos="zoom-in">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-card-foreground">
          <span className="bg-gradient-to-tr from-red-800 via-red-600 to-rose-500 bg-clip-text text-transparent">Ready to elevate your social media?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start your free trial today and experience the difference. 
          Join thousands of creators who are already growing their audience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link href="/sign-up">
            <Button size="lg" className="text-lg px-8 py-6 btn-micro-effect bg-accent text-foreground hover:bg-accent/80">
              <span className="bg-gradient-to-tr from-red-800 via-red-600 to-rose-500 bg-clip-text text-transparent font-bold">Get Started Free</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 btn-micro-effect border-accent hover:bg-accent/10">
            <span className="bg-gradient-to-tr from-red-800 via-red-600 to-rose-500 bg-clip-text text-transparent font-bold">Schedule Demo</span>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm">No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm">14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm">Cancel anytime</span>
          </div>
        </div>
      </div>
    </Section>
  )
} 