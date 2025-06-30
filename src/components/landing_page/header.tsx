'use client'

import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (section: string) => {
    if (pathname === '/') {
      // Ana sayfadaysak, smooth scroll ile bölüme git
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Başka sayfadaysak, ana sayfaya git ve bölüme scroll yap
      router.push(`/#${section}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl text-white">Social SaaS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => handleNavigation('features')}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <button 
            onClick={() => handleNavigation('about')}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonPopoverCard: "bg-slate-800 border-slate-700",
                  userButtonPopoverActionButton: "text-slate-300 hover:text-white hover:bg-slate-700",
                  userButtonPopoverActionButtonText: "text-slate-300",
                  userButtonPopoverFooter: "border-slate-700",
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
} 