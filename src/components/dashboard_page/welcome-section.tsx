'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@clerk/nextjs'
import { Crown, Sparkles } from 'lucide-react'

export function WelcomeSection() {
  const { user, isLoaded } = useUser()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getUserName = () => {
    if (!user) return ''
    return user.firstName || user.fullName || user.emailAddresses[0]?.emailAddress || ''
  }

  const getUserPlan = () => {
    if (!user) return 'free'
    return (user.publicMetadata?.plan as string) || 'free'
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'Pro'
      case 'premium':
        return 'Premium'
      default:
        return 'Free'
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
      case 'premium':
        return <Crown className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none'
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none'
      default:
        return 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'
    }
  }

  if (!isLoaded) {
    return (
      <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-48 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const userName = getUserName()
  const userPlan = getUserPlan()

  return (
    <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-50 mb-1">
              {getGreeting()}{userName ? `, ${userName}` : ''}!
            </h1>
            <p className="text-gray-200">
              Ready to create amazing AI-powered carousel content?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={getPlanBadgeClass(userPlan)}
            >
              {getPlanIcon(userPlan)}
              <span className="ml-1">{getPlanDisplayName(userPlan)}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 