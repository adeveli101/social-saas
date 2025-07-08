'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  Share2,
  Smartphone
} from "lucide-react"
import { useEffect } from "react"
import AOS from "aos"
import { Section } from "@/components/shared/page-container"
import { AnimatedGradientText } from "@/components/shared/AnimatedGradientText"
import { StaticGradientText } from "@/components/shared/StaticGradientText"

const features = [
  {
    title: "Smart Scheduling",
    description: "Plan and automate your posts across all platforms with intelligent timing",
    icon: Calendar,
    badge: "Popular"
  },
  {
    title: "Analytics Dashboard",
    description: "Track engagement, reach, and growth with real-time insights",
    icon: BarChart3,
    badge: "New"
  },
  {
    title: "Team Collaboration",
    description: "Work with your team to manage content and campaigns effectively",
    icon: MessageSquare,
    badge: "Pro"
  },
  {
    title: "Content Calendar",
    description: "Visualize and organize your content strategy with our intuitive calendar",
    icon: Settings,
    badge: "Free"
  },
  {
    title: "Social Listening",
    description: "Monitor mentions and engage with your audience in real-time",
    icon: Share2,
    badge: "Pro"
  },
  {
    title: "Mobile App",
    description: "Manage your social media on the go with our mobile application",
    icon: Smartphone,
    badge: "Coming Soon"
  }
]

export function FeaturesSection() {
  useEffect(() => { AOS.init({ once: true, duration: 700 }) }, [])
  return (
    <Section 
      gradient="features" 
      className="py-16"
      subtitle="Everything you need to manage, analyze, and grow your social presence."
      animate={true}
      containerClassName="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto"
      center={true}
    >
      <h2 className="font-semibold mb-4 text-3xl md:text-4xl text-center heading-gradient heading text-[var(--heading-foreground)]">
        Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-[var(--background)]/80 rounded-2xl shadow-lg p-6 border border-[var(--border)] card-animated hover:shadow-xl transition-all duration-400 ease-out hover:border-[var(--primary)]/20 transform-gpu hover:scale-105 group"
            data-aos="fade-up" 
            data-aos-delay={index * 100}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--heading-gradient-from)] to-[var(--heading-gradient-to)] rounded-lg flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-[var(--primary)]" />
              </div>
              {feature.badge && (
                <Badge variant="outline" className="text-xs border-[var(--primary)]/20 text-[var(--primary)] hover:grow-text transition-transform duration-400 ease-out group-hover:scale-105">
                  {feature.badge}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 heading-gradient heading text-[var(--heading-foreground)] hover:grow-text transition-transform duration-400 ease-out group-hover:scale-105">
              {feature.title}
            </h3>
            <p className="text-[var(--heading-foreground)] text-sm leading-relaxed hover:grow-text transition-transform duration-400 ease-out group-hover:scale-105">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
} 