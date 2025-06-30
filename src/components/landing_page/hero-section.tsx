import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <Badge variant="secondary" className="mb-4 bg-surface-secondary/50 text-text-secondary border-surface-border backdrop-blur-sm">
        🚀 Now in Beta
      </Badge>
      <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
        Manage Your Social Media
        <span className="block text-gradient">
          Like a Pro
        </span>
      </h1>
      <p className="text-xl text-text-secondary/90 mb-8 max-w-2xl mx-auto">
        Streamline your social media presence with our all-in-one platform. 
        Schedule posts, analyze performance, and grow your audience effortlessly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/carousel">
          <Button size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-white/90 font-semibold">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-surface-border text-text-primary hover:bg-surface-secondary">
          Watch Demo
        </Button>
      </div>
      
      {/* Social Proof */}
      <div className="mt-12 flex items-center justify-center space-x-8 text-text-tertiary">
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-accent-amber text-accent-amber" />
            ))}
          </div>
          <span>4.9/5 from 2,000+ users</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>10,000+ active users</span>
        </div>
      </div>
    </section>
  )
} 