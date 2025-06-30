'use client'

import { Button } from "@/components/ui/button"
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { Bell, Settings, User, Crown } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function DashboardHeader() {
  const { user } = useUser()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserPlan() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Get plan from user metadata
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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl text-white">Social SaaS</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* Plan Badge */}
          {!loading && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-full">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-300 capitalize">
                {currentPlan}
              </span>
            </div>
          )}
          
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
        </div>
      </div>
    </header>
  )
} 