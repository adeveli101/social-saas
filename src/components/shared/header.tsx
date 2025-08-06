'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs'
import { StyledSignInButton, StyledSignUpButton } from '@/components/auth/clerk-components'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut, LayoutDashboard, Sparkles, Image } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getUserInitials = () => {
    if (!user) return 'U'
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'
  }

  const getUserName = () => {
    if (!user) return 'User'
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-white/10 transition-all duration-300 rounded-b-3xl ${
      isScrolled 
        ? 'backdrop-blur-xl shadow-2xl shadow-black/20' 
        : 'backdrop-blur-md shadow-lg shadow-black/10'
    }`}>
      <div className="w-full px-4">
        <div className="flex h-16 items-center justify-between w-full">
          {/* Logo - En sola dayalı */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-50">Carousel Studio</span>
            </Link>
          </div>

          {/* Sağ kısım - En sağa dayalı */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Desktop Navigation - Sadece sağda görünür */}
            <nav className="hidden lg:flex items-center space-x-6 mr-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-200 transition-colors hover:bg-transparent hover:text-white">
                    Features
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 bg-glass backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl p-2"
                >
                  <div className="p-3 border-b border-white/10 mb-2">
                    <p className="text-sm font-semibold text-gray-50">Create Amazing Content</p>
                    <p className="text-xs text-gray-400">AI-powered tools for creators</p>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/carousel" className="flex items-start gap-3 cursor-pointer group hover:scale-105 transition-transform duration-200">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 group-hover:border-blue-400/50 transition-all duration-200">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-50">Carousel Creator</span>
                          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">Popular</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Create stunning AI carousels in minutes</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/content-board" className="flex items-start gap-3 cursor-pointer group hover:scale-105 transition-transform duration-200">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 group-hover:border-purple-400/50 transition-all duration-200">
                        <Image className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-50">Content Board</span>
                        <p className="text-xs text-gray-400 mt-1">Organize and plan your content</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  
                  <div className="p-3 border-t border-white/10 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span>New features coming soon</span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/pricing" className="text-gray-200 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-200 hover:text-white transition-colors">
                About
              </Link>
            </nav>

            {/* Auth Buttons */}
            <SignedOut>
              <StyledSignInButton mode="modal">
                <Button variant="ghost" className="text-gray-200 hover:text-white">
                  Sign In
                </Button>
              </StyledSignInButton>
              <StyledSignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </StyledSignUpButton>
            </SignedOut>
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
                    <Avatar className="h-8 w-8 ring-2 ring-white/20">
                      <AvatarImage src={user?.imageUrl} alt={getUserName()} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-50">{getUserName()}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-glass backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl"
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-medium text-gray-50">{getUserName()}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 text-blue-400" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-200 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <div className="space-y-3">
                <div className="px-2">
                  <p className="text-sm font-semibold text-gray-50">Create Amazing Content</p>
                  <p className="text-xs text-gray-400">AI-powered tools for creators</p>
                </div>
                <Link 
                  href="/carousel" 
                  className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors px-3 py-3 rounded-lg hover:scale-105 transition-transform duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 group-hover:border-blue-400/50 transition-all duration-200">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Carousel Creator</span>
                      <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">Popular</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Create stunning AI carousels in minutes</p>
                  </div>
                </Link>
                <Link 
                  href="/content-board" 
                  className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors px-3 py-3 rounded-lg hover:scale-105 transition-transform duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 group-hover:border-purple-400/50 transition-all duration-200">
                    <Image className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">Content Board</span>
                    <p className="text-xs text-gray-400 mt-1">Organize and plan your content</p>
                  </div>
                </Link>
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span>New features coming soon</span>
                  </div>
                </div>
              </div>
              <Link 
                href="/pricing" 
                className="text-gray-200 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="text-gray-200 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-4 border-t border-white/10">
                <SignedOut>
                  <div className="flex flex-col space-y-3">
                    <StyledSignInButton mode="modal">
                      <Button variant="ghost" className="w-full text-gray-200 hover:text-white">
                        Sign In
                      </Button>
                    </StyledSignInButton>
                    <StyledSignUpButton mode="modal">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                        Get Started
                      </Button>
                    </StyledSignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <Avatar className="h-10 w-10 ring-2 ring-white/20">
                      <AvatarImage src={user?.imageUrl} alt={getUserName()} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-50">{getUserName()}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 text-gray-200 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 