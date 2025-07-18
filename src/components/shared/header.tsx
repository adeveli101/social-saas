'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Bell, Crown, Menu, X, CheckSquare, Image, BarChart3, Zap, BrainCircuit } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function loadUserPlan() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const plan = user.publicMetadata?.plan as string || 'free'
        setCurrentPlan(plan)
      } catch (error) {
        console.error('Error loading user plan:', error)
        setCurrentPlan('free')
      } finally {
        setLoading(false)
      }
    }

    loadUserPlan()
  }, [user])

  const handleNavigation = (section: string) => {
    setMobileMenuOpen(false)
    if (pathname === '/') {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push(`/#${section}`)
    }
  }

  const isLandingPage = pathname === '/'
  const isPricing = pathname === '/pricing'
  const isCarousel = pathname.startsWith('/carousel')

  // Plan badge renkleri - Ultra-dark gradient theme için
  const getPlanBadgeClass = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'starter':
        return 'bg-blue-500/20 text-blue-200 border border-blue-400/50 backdrop-blur-sm shadow-lg';
      case 'creator':
        return 'bg-purple-500/20 text-purple-200 border border-purple-400/50 backdrop-blur-sm shadow-lg';
      case 'free':
        return 'bg-gray-500/20 text-gray-200 border border-gray-400/50 backdrop-blur-sm shadow-lg';
      default:
        return 'bg-gray-500/20 text-gray-200 border border-gray-400/50 backdrop-blur-sm shadow-lg';
    }
  };

  const getPlanIcon = (plan: string, className = "") => {
    switch (plan.toLowerCase()) {
      case 'starter':
        return <Zap className={`${className} text-blue-400`} />;
      case 'creator':
        return <Crown className={`${className} text-purple-400`} />;
      case 'free':
        return <BrainCircuit className={`${className} text-gray-400`} />;
      default:
        return <Zap className={`${className} text-blue-400`} />;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-slate-950/95 via-blue-950/90 to-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5 pointer-events-none"></div>
      <div className="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto py-4 relative">
        <div className="flex items-center justify-between w-full">
          {/* Logo - always far left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-xl shadow-blue-500/25">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-gray-50">Social SaaS</span>
            </Link>
          </div>

          {/* Navigation - center on wide screens, hidden on mobile */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="px-3 py-2 rounded-md text-gray-200 hover:text-gray-50 hover:bg-white/10 transition-colors">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard" className="px-3 py-2 rounded-md text-gray-200 hover:text-gray-50 hover:bg-white/10 transition-colors">
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-3 py-2 rounded-md text-gray-200 hover:text-gray-50 transition-colors border-none shadow-none bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="bg-glass backdrop-blur-xl border border-white/10 p-4 w-[260px] md:w-[320px] lg:w-[360px] rounded-lg shadow-2xl">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium leading-none text-gray-50">Task Management</h4>
                          <div className="space-y-2">
                            <Link href="/content-board" className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/10 transition-colors">
                              <CheckSquare className="h-4 w-4 text-blue-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-50">Content Planning</div>
                                <div className="text-xs text-gray-300">Plan and manage your content</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium leading-none text-gray-50">Content Creation</h4>
                          <div className="space-y-2">
                            <NavigationMenuLink asChild>
                              <a
                                href="/carousel"
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500/20 to-blue-500/20 p-6 no-underline outline-none focus:shadow-md border border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors"
                              >
                                <BrainCircuit size={40} className="text-purple-400" />
                                <div className="mb-2 mt-4 text-lg font-bold text-gray-50">AI Carousel Generator</div>
                                <div className="text-xs text-gray-300">Create social media carousels with AI</div>
                              </a>
                            </NavigationMenuLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/pricing" className="px-3 py-2 rounded-md text-gray-200 hover:text-gray-50 hover:bg-white/10 transition-colors">
                      Pricing
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions - always far right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Dashboard-specific elements */}
            {user && (
              <>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-gray-50 hover:bg-white/10 border-none shadow-none">
                  <Bell className="h-5 w-5" />
                </Button>
                
                {!loading && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors ${getPlanBadgeClass(currentPlan)}`} tabIndex={0} aria-label="View or change your subscription plan">
                        {getPlanIcon(currentPlan, `h-4 w-4`)}
                        <span className={`text-sm font-medium capitalize`}>
                          {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={8} className="w-80 bg-glass backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                          {getPlanIcon(currentPlan, `h-5 w-5`)}
                          <span className={`font-semibold capitalize px-2 py-1 rounded text-gray-50`}>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()}</span>
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          You are currently on the <span className="font-medium text-gray-50">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()}</span> plan. Click below to see all benefits and upgrade your plan.
                        </div>
                        <Link href="/pricing" passHref legacyBehavior>
                          <Button asChild className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg" variant="default">
                            <a>Change Plan</a>
                          </Button>
                        </Link>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </>
            )}

            <SignedOut>
              <div className="hidden md:flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-gray-300 hover:text-gray-50 hover:bg-white/10 border-none shadow-none">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-2 ring-white/20",
                    userButtonPopoverCard: "bg-glass backdrop-blur-xl border-white/20",
                    userButtonPopoverActionButton: "text-gray-300 hover:text-gray-50 hover:bg-white/10",
                    userButtonPopoverActionButtonText: "text-gray-300",
                    userButtonPopoverFooter: "border-white/10",
                  }
                }}
              />
            </SignedIn>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-300 hover:text-gray-50 hover:bg-white/10 border-none shadow-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-white/10">
            <nav className="pt-4 space-y-2 bg-glass backdrop-blur-xl rounded-lg mt-4 p-4 border border-white/10 shadow-2xl">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-gray-300 hover:text-gray-50 hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-gray-300 hover:text-gray-50 hover:bg-white/10"
              >
                Dashboard
              </Link>
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm font-medium text-gray-50">Features</div>
                <Link
                  href="/content-board"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-8 rounded-md transition-colors text-gray-300 hover:text-gray-50 hover:bg-white/10"
                >
                  Content Planning
                </Link>
                <Link
                  href="/carousel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-8 rounded-md transition-colors text-gray-300 hover:text-gray-50 hover:bg-white/10"
                >
                  Carousel Creator
                </Link>
              </div>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-gray-300 hover:text-gray-50 hover:bg-white/10"
              >
                Pricing
              </Link>
              
              {/* Mobile Auth Buttons */}
              <SignedOut>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-gray-50 hover:bg-white/10 border-none shadow-none"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Mobile Dashboard Elements */}
              {user && (
                <div className="pt-4 border-t border-white/10">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-300 hover:text-gray-50 hover:bg-white/10 border-none shadow-none"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </Button>
                  {!loading && (
                    <div className="flex items-center space-x-2 px-4 py-2 mt-2">
                      {getPlanIcon(currentPlan, "h-4 w-4")}
                      <span className="text-sm font-medium text-gray-300 capitalize">
                        {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()} Plan
                      </span>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 