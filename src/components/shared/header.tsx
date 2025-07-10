'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Bell, Crown, Menu, X, CheckSquare, Image, BarChart3, Zap } from "lucide-react"
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

  // Plan badge renkleri
  const getPlanBadgeClass = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pro':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'business':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-[var(--accent)] text-[var(--muted-foreground)] border-[var(--border)]';
    }
  };

  const getPlanTextClass = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free':
        return 'text-green-700';
      case 'pro':
        return 'text-blue-700';
      default:
        return 'text-[var(--muted-foreground)]';
    }
  };

  const getPlanIcon = (plan: string, className = "") => {
    switch (plan.toLowerCase()) {
      case 'free':
        return <Zap className={className} />;
      case 'pro':
        return <Crown className={className} />;
      default:
        return <Crown className={className} />;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo - always far left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 rounded-lg flex items-center justify-center">
                <span className="text-[var(--primary-foreground)] font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl heading-gradient heading heading-[var(--foreground)]">Social SaaS</span>
            </Link>
          </div>

          {/* Navigation - center on wide screens, hidden on mobile */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]/20 transition-colors">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard" className="px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]/20 transition-colors">
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-3 py-2 rounded-md text-[var(--foreground)] transition-colors border-none shadow-none bg-transparent hover:bg-[var(--muted)]/20 data-[state=open]:bg-[var(--muted)]/20">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="bg-[var(--card)] p-4 w-[260px] md:w-[320px] lg:w-[360px]">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium leading-none">Task Management</h4>
                          <div className="space-y-2">
                            <Link href="/content-board" className="flex items-center space-x-2 p-2 rounded-md hover:bg-[var(--muted)]/20 transition-colors">
                              <CheckSquare className="h-4 w-4" />
                              <div>
                                <div className="text-sm font-medium">Content Planning</div>
                                <div className="text-xs text-[var(--muted-foreground)]">Plan and manage your content</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium leading-none">Content Creation</h4>
                          <div className="space-y-2">
                            <Link href="/carousel" className="flex items-center space-x-2 p-2 rounded-md hover:bg-[var(--muted)]/20 transition-colors">
                              <Image className="h-4 w-4" />
                              <div>
                                <div className="text-sm font-medium">Carousel Creator</div>
                                <div className="text-xs text-[var(--muted-foreground)]">Create Instagram carousels with AI</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/pricing" className="px-3 py-2 rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]/20 transition-colors">
                      Pricing
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions - always far right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <ThemeToggle />
            
            {/* Dashboard-specific elements */}
            {user && (
              <>
                <Button variant="ghost" size="sm" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]">
                  <Bell className="h-5 w-5" />
                </Button>
                
                {!loading && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full cursor-pointer hover:bg-[var(--primary)]/10 transition-colors border bg-[var(--card)] border-[var(--border)]`} tabIndex={0} aria-label="View or change your subscription plan">
                        {getPlanIcon(currentPlan, `h-4 w-4 ${getPlanTextClass(currentPlan)}`)}
                        <span className={`text-sm font-medium capitalize ${getPlanTextClass(currentPlan)}`}>
                          {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={8} className="w-80 bg-[var(--card)] border border-[var(--border)] shadow-lg">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                          {getPlanIcon(currentPlan, `h-5 w-5 ${getPlanTextClass(currentPlan)}`)}
                          <span className={`font-semibold capitalize px-2 py-1 rounded ${getPlanTextClass(currentPlan)}`}>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()}</span>
                        </div>
                        <div className="text-sm text-[var(--muted-foreground)] mb-2">
                          You are currently on the <span className="font-medium text-[var(--foreground)]">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()}</span> plan. Click below to see all benefits and upgrade your plan.
                        </div>
                        <Link href="/pricing" passHref legacyBehavior>
                          <Button asChild className="w-full mt-2" variant="default">
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
                  <Button variant="ghost" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                    userButtonPopoverCard: "bg-popover border-[var(--border)]",
                    userButtonPopoverActionButton: "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]",
                    userButtonPopoverActionButtonText: "text-[var(--muted-foreground)]",
                    userButtonPopoverFooter: "border-[var(--border)]",
                  }
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-[var(--border)]">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50"
              >
                Dashboard
              </Link>
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm font-medium text-[var(--foreground)]">Features</div>
                <Link
                  href="/content-board"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-8 rounded-md transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50"
                >
                  Content Planning
                </Link>
                <Link
                  href="/carousel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-8 rounded-md transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50"
                >
                  Carousel Creator
                </Link>
              </div>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50"
              >
                Pricing
              </Link>
              
              {/* Mobile Auth Buttons */}
              <SignedOut>
                <div className="flex flex-col space-y-2 pt-4 border-t border-[var(--border)]">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="w-full justify-start bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Mobile Dashboard Elements */}
              {user && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </Button>
                  {!loading && (
                    <div className="flex items-center space-x-2 px-4 py-2 mt-2">
                      {getPlanIcon(currentPlan, "h-4 w-4 text-[var(--primary)]")}
                      <span className="text-sm font-medium text-[var(--muted-foreground)] capitalize">
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