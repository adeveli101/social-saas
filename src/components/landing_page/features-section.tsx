'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BrainCircuit,
  Palette,
  Download,
  BookTemplate,
  Zap,
  Image
} from "lucide-react"
import { useEffect } from "react"
import AOS from "aos"
import { Section } from "@/components/shared/page-container"
import { AnimatedGradientText } from "@/components/shared/AnimatedGradientText"
import { StaticGradientText } from "@/components/shared/StaticGradientText"

const features = [
  {
    title: "AI-Powered Generation",
    description: "Create stunning carousels with advanced AI that understands your content and brand",
    icon: BrainCircuit,
    badge: "Core"
  },
  {
    title: "Premium Templates",
    description: "Choose from 50+ professionally designed templates for every industry and style",
    icon: BookTemplate,
    badge: "Popular"
  },
  {
    title: "Style Customization",
    description: "Apply different visual styles and customize colors, fonts, and layouts",
    icon: Palette,
    badge: "Creative"
  },
  {
    title: "Instant Downloads",
    description: "Export your carousels in high-quality formats ready for any platform",
    icon: Download,
    badge: "Essential"
  },
  {
    title: "Smart Prompts",
    description: "Use structured prompts or natural language to generate exactly what you need",
    icon: Zap,
    badge: "Smart"
  },
  {
    title: "Multi-Format Support",
    description: "Generate carousels optimized for Instagram, LinkedIn, Facebook, and more",
    icon: Image,
    badge: "Flexible"
  }
]

const getBadgeVariant = (badge: string) => {
  switch (badge) {
    case "Core": return "bg-blue-500/20 text-blue-200 border-blue-400/40"
    case "Popular": return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
    case "Creative": return "bg-purple-500/20 text-purple-200 border-purple-400/40"
    case "Essential": return "bg-amber-500/20 text-amber-200 border-amber-400/40"
    case "Smart": return "bg-indigo-500/20 text-indigo-200 border-indigo-400/40"
    case "Flexible": return "bg-pink-500/20 text-pink-200 border-pink-400/40"
    default: return "bg-slate-500/20 text-slate-200 border-slate-400/40"
  }
}

export function FeaturesSection() {
  useEffect(() => { AOS.init({ once: true, duration: 700 }) }, [])

  return (
    <Section 
      id="features" 
      gradient="none"
      className="py-20 bg-gradient-natural" 
      containerClassName="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto"
    >
      <div className="text-center mb-16" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-gray-50">Powerful AI Features for </span>
          <AnimatedGradientText>Content Creation</AnimatedGradientText>
        </h2>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Transform your ideas into stunning social media carousels with cutting-edge AI technology and professional design tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={feature.title}
            className="card-hover-effect bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-blue-300" />
                </div>
                <Badge className={`text-xs px-2 py-1 ${getBadgeVariant(feature.badge)}`}>
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-xl font-semibold text-gray-50">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-200 leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16" data-aos="fade-up">
        <p className="text-lg text-gray-200 mb-4">
          Ready to create your first AI carousel?
        </p>
        <StaticGradientText className="text-lg font-semibold">
          Start generating stunning content today!
        </StaticGradientText>
      </div>
    </Section>
  )
} 