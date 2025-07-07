'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Bell, Crown, Menu, X, CheckSquare, Image, BarChart3 } from "lucide-react"
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
  const isDashboard = pathname.startsWith('/dashboard')
  const isPricing = pathname === '/pricing'
  const isTodo = pathname.startsWith('/todo')
  const isCarousel = pathname.startsWith('/carousel')

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
      <div className="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo - always far left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-foreground">Social SaaS</span>
            </Link>
          </div>

          {/* Navigation - center on wide screens, hidden on mobile */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className={navigationMenuTriggerStyle()}>
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Dashboard */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard" className={navigationMenuTriggerStyle()}>
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Features Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px]">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium leading-none">Task Management</h4>
                          <div className="space-y-2">
                            <Link href="/todo" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                              <CheckSquare className="h-4 w-4" />
                              <div>
                                <div className="text-sm font-medium">Todo Management</div>
                                <div className="text-xs text-muted-foreground">Organize tasks and stay productive</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium leading-none">Content Creation</h4>
                          <div className="space-y-2">
                            <Link href="/carousel" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                              <Image className="h-4 w-4" />
                              <div>
                                <div className="text-sm font-medium">Carousel Creator</div>
                                <div className="text-xs text-muted-foreground">Create Instagram carousels with AI</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/pricing" className={navigationMenuTriggerStyle()}>
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
            {(isDashboard || isTodo) && (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Bell className="h-5 w-5" />
                </Button>
                
                {!loading && (
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-accent rounded-full">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {currentPlan}
                    </span>
                  </div>
                )}
              </>
            )}

            <SignedOut>
              <div className="hidden md:flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                    userButtonPopoverCard: "bg-popover border-border",
                    userButtonPopoverActionButton: "text-muted-foreground hover:text-foreground hover:bg-accent",
                    userButtonPopoverActionButtonText: "text-muted-foreground",
                    userButtonPopoverFooter: "border-border",
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
          <div className="lg:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                Dashboard
              </Link>
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm font-medium text-foreground">Features</div>
                <Link
                  href="/todo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-8 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  Todo Management
                </Link>
                <Link
                  href="/carousel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-8 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  Carousel Creator
                </Link>
              </div>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                Pricing
              </Link>
              
              {/* Mobile Auth Buttons */}
              <SignedOut>
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Mobile Dashboard Elements */}
              {(isDashboard || isTodo) && (
                <div className="pt-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </Button>
                  {!loading && (
                    <div className="flex items-center space-x-2 px-4 py-2 mt-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-muted-foreground capitalize">
                        {currentPlan} Plan
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