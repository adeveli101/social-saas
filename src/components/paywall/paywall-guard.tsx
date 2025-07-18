'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Lock, Crown, Zap } from 'lucide-react'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/plans'

interface PaywallGuardProps {
  children: React.ReactNode
  feature: string
  requiredPlan?: string
  fallback?: React.ReactNode
}

export function PaywallGuard({ 
  children, 
  feature, 
  requiredPlan = 'pro',
  fallback 
}: PaywallGuardProps) {
  const { user } = useUser()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/check-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feature, requiredPlan }),
        })

        if (response.ok) {
          const { hasAccess } = await response.json()
          setHasAccess(hasAccess)
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error('Error checking access:', error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [user, feature, requiredPlan])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (hasAccess) {
    return <>{children}</>
  }

  const requiredPlanData = SUBSCRIPTION_PLANS.find(p => p.id === requiredPlan)
  const currentPlan = user?.publicMetadata?.plan as string || 'free'
  const currentPlanData = SUBSCRIPTION_PLANS.find(p => p.id === currentPlan)

  const getFeatureIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="h-4 w-4" />
      case 'pro':
        return <Crown className="h-4 w-4" />
      case 'business':
        return <Crown className="h-4 w-4 text-yellow-500" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const defaultFallback = (
    <Card className="w-full max-w-md mx-auto bg-glass backdrop-blur-sm border border-white/10">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-glass border border-white/20">
          <Lock className="h-6 w-6 text-gray-300" />
        </div>
        <CardTitle className="text-xl text-gray-50">Premium Feature</CardTitle>
        <CardDescription className="text-gray-200">
          This feature requires a {requiredPlanData?.name} plan or higher
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-glass border border-white/10 rounded-lg">
          <div className="flex items-center space-x-2">
            {getFeatureIcon(currentPlan)}
            <span className="text-sm text-gray-200">Current: {currentPlanData?.name}</span>
          </div>
          <Badge className="bg-white/10 text-gray-200 border border-white/20">{currentPlanData?.name}</Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-400/50 rounded-lg">
          <div className="flex items-center space-x-2">
            {getFeatureIcon(requiredPlan)}
            <span className="text-sm text-blue-200">Required: {requiredPlanData?.name}</span>
          </div>
          <Badge className="bg-blue-500/30 text-blue-200 border border-blue-400/50">{requiredPlanData?.name}</Badge>
        </div>

        <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
              Upgrade to {requiredPlanData?.name}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-glass backdrop-blur-xl border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-gray-50">Upgrade Your Plan</DialogTitle>
              <DialogDescription className="text-gray-200">
                Unlock {feature} and many more features with {requiredPlanData?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isCurrentPlan = currentPlan === plan.id
                  const isRequiredPlan = requiredPlan === plan.id
                  
                  return (
                    <Card 
                      key={plan.id}
                      className={`relative bg-glass backdrop-blur-sm border ${
                        isRequiredPlan ? 'border-blue-400/50 bg-blue-500/20' : 'border-white/10'
                      } ${isCurrentPlan ? 'ring-2 ring-emerald-400/50' : ''}`}
                    >
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-lg text-gray-50">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-blue-400">
                          ${plan.monthlyPrice}/month
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <ul className="space-y-2 text-sm">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full ${
                            isCurrentPlan
                              ? 'bg-green-600 hover:bg-green-700'
                              : isRequiredPlan
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )

  return fallback || defaultFallback
} 