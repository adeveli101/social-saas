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
      <div className="rounded-2xl bg-[var(--background)]/80 shadow-xl p-10 text-center border border-[var(--border)] hover:border-[var(--primary)]/20 transition-all duration-300 mx-auto max-w-2xl" data-aos="zoom-in">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 heading-gradient heading text-[var(--heading-foreground)]">
          Ready to elevate your social media?
        </h2>
        <p className="text-lg text-[var(--heading-foreground)] mb-8 max-w-2xl mx-auto">
          Start your free trial today and experience the difference. 
          Join thousands of creators who are already growing their audience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link href="/sign-up">
            <Button size="lg" className="text-lg px-8 py-6 btn-micro-effect bg-[var(--accent)] text-[var(--foreground)] hover:bg-[var(--accent)]/80">
              <span className="heading-gradient heading font-bold">Get Started Free</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 btn-micro-effect border-[var(--accent)] hover:bg-[var(--accent)]/10">
            <span className="heading-gradient heading font-bold">Schedule Demo</span>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-[var(--muted)]">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-[var(--muted)]" />
            <span className="text-sm">No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-[var(--muted)]" />
            <span className="text-sm">14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-[var(--muted)]" />
            <span className="text-sm">Cancel anytime</span>
          </div>
        </div>
      </div>
    </Section>
  )
} 