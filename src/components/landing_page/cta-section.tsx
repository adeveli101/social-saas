import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to transform your social media?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of creators and businesses who are already using our platform 
          to grow their social media presence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/carousel">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary-600 hover:bg-white/90 shadow-2xl shadow-blue-500/30">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
            Schedule Demo
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-400" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-400" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
} 