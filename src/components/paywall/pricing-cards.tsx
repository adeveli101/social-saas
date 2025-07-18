'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, ArrowRight } from 'lucide-react'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/plans'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface PricingCardsProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void
  currentPlan?: string
}

export function PricingCards({ onSelectPlan, currentPlan }: PricingCardsProps) {
  const [billingInterval, setBillingInterval] = useState<'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState<string | null>(null)
  const { user } = useUser()
  const router = useRouter()

  const getPlanPrice = (plan: SubscriptionPlan) => {
    switch (billingInterval) {
      case 'week':
        return { amount: plan.weeklyPrice, period: 'week' }
      case 'year':
        return { amount: plan.yearlyPrice, period: 'year' }
      default:
        return { amount: plan.monthlyPrice, period: 'month' }
    }
  }

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    setLoading(plan.id)

    try {
      if (onSelectPlan) {
        onSelectPlan(plan)
      } else {
        // Default plan selection logic
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan: plan.id }),
        })

        if (response.ok) {
          router.refresh()
        } else {
          throw new Error('Failed to update plan')
        }
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-glass backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
          <button
            onClick={() => setBillingInterval('week')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              billingInterval === 'week'
                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50 shadow-lg'
                : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              billingInterval === 'month'
                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50 shadow-lg'
                : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              billingInterval === 'year'
                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50 shadow-lg'
                : 'text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Yearly
            <Badge className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-[10px] px-1.5 py-0.5">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl grid-rows-1">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id
            const isPopular = plan.popular
            const isLoading = loading === plan.id
            const priceInfo = getPlanPrice(plan)
            
            return (
              <div key={plan.id} className="relative">
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs font-semibold shadow-lg border-0">
                      BEST VALUE
                    </Badge>
                  </div>
                )}
                
                <Card 
                  className={`relative transition-all duration-300 hover:scale-[1.02] flex flex-col h-full ${
                    isPopular 
                      ? 'bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm border-2 border-blue-400/40 shadow-2xl shadow-blue-500/10' 
                      : 'bg-gradient-to-br from-blue-500/3 via-slate-500/5 to-blue-500/3 backdrop-blur-sm border-2 border-blue-400/30 shadow-xl shadow-blue-500/5'
                  } ${isCurrentPlan ? 'ring-1 ring-emerald-400/40' : ''}`}
                  style={{
                    background: isPopular 
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(59,130,246,0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(71,85,105,0.08) 50%, rgba(59,130,246,0.05) 100%)'
                  }}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-xs">
                        Current
                      </Badge>
                    </div>
                  )}

                <CardHeader className="text-center pt-4 pb-3">
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm bg-white/5 border border-white/20">
                      {plan.id === 'starter' ? 
                        <Zap className="h-5 w-5 text-gray-300" /> : 
                        <Crown className="h-5 w-5 text-gray-300" />
                      }
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-50 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-3">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-gray-50">
                        ${priceInfo.amount}
                      </span>
                      <span className="text-gray-200 text-xs">
                        /{priceInfo.period}
                      </span>
                    </div>
                    {billingInterval === 'year' && (
                      <p className="text-xs text-gray-300 mt-1">
                        ${plan.monthlyPrice}/month when billed monthly
                      </p>
                    )}
                  </div>

                  <CardDescription className="text-gray-300 text-xs">
                    {plan.id === 'starter' 
                      ? 'Perfect for trying out AI carousels' 
                      : 'Professional features for content creators'
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-4 pb-4 flex-1 flex flex-col justify-between">
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-2.5 w-2.5 text-emerald-300" />
                        </div>
                        <span className="text-xs text-gray-200 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isCurrentPlan || isLoading}
                    className={`w-full h-9 text-xs font-semibold transition-all duration-300 ${
                      isCurrentPlan
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 cursor-not-allowed'
                        : isPopular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border-0'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg hover:shadow-xl border-0'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Get Started</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-8">
        <p className="text-gray-200 mb-2 text-xs">
          Need a custom solution for your team?
        </p>
        <Button variant="outline" className="border-white/20 text-gray-200 hover:bg-white/10 hover:text-white hover:border-white/30 text-xs h-8 px-4">
          Contact Sales
        </Button>
      </div>
    </div>
  )
} 