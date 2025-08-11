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
  excludePlanIds?: string[]
  introDiscountPercent?: number
}

type BillingPeriod = 'week' | 'month' | 'year'

export function PricingCards({ onSelectPlan, currentPlan, excludePlanIds = [], introDiscountPercent }: PricingCardsProps) {
  const [billingInterval, setBillingInterval] = useState<'week' | 'month' | 'year'>('week')
  const [loading, setLoading] = useState<string | null>(null)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const { user } = useUser()
  const router = useRouter()

  const getPlanPrice = (plan: SubscriptionPlan): { amount: number; period: BillingPeriod } => {
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

  const formatCurrency = (amount: number) => {
    const fixed = amount.toFixed(2)
    return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed
  }

  const getDailyApprox = (amount: number, period: 'week' | 'month' | 'year') => {
    const divisor = period === 'week' ? 7 : period === 'year' ? 365 : 30
    const perDay = amount / divisor
    const fixed = perDay.toFixed(2)
    return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed
  }

  const visiblePlans = SUBSCRIPTION_PLANS.filter((plan) => !excludePlanIds.includes(plan.id))
  const targetPlan = visiblePlans.find(p => p.popular) ?? visiblePlans[0]

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 md:pb-0">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-glass backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
          <button
            onClick={() => setBillingInterval('week')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              billingInterval === 'week'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              billingInterval === 'month'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              billingInterval === 'year'
                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50 shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
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
      <div className="flex justify-center pricing-scale-90 pricing-vertical-90">
        <div className="pricing-horizontal-80 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 max-w-3xl grid-rows-1">
          {visiblePlans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id
            const isPopular = plan.popular
            const isLoading = loading === plan.id
            const priceInfo = getPlanPrice(plan)
            const isPaidPlan = plan.id !== 'free'
            const baseAmount = priceInfo.amount
            const introAmount = (introDiscountPercent && isPaidPlan && billingInterval === 'week')
              ? Number((baseAmount * (1 - introDiscountPercent / 100)).toFixed(2))
              : null
            
            return (
              <div key={plan.id} className="relative">
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs font-semibold shadow-lg border-0">
                      BEST VALUE
                    </Badge>
                  </div>
                )}
                {introDiscountPercent && isPaidPlan && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 text-[10px] px-1.5 py-0.5">
                      First week -{introDiscountPercent}%
                    </Badge>
                  </div>
                )}
                
                <Card 
                  onMouseEnter={() => setHoveredCardId(plan.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`group relative transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl flex flex-col h-full ${
                    isPopular 
                      ? 'bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm border-2 border-blue-400/40 shadow-2xl shadow-blue-500/10' 
                      : 'bg-gradient-to-br from-blue-500/3 via-slate-500/5 to-blue-500/3 backdrop-blur-sm border-2 border-blue-400/30 shadow-xl shadow-blue-500/5'
                  } ${isCurrentPlan ? 'ring-1 ring-emerald-400/40' : ''} ${hoveredCardId === plan.id ? 'scale-[1.015] shadow-2xl' : ''}`}
                  style={{
                    background: isPopular 
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(59,130,246,0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(71,85,105,0.08) 50%, rgba(59,130,246,0.05) 100%)'
                  }}
                >
                  {/* subtle gradient ring on hover */}
                  <div className={`pointer-events-none absolute inset-0 rounded-[calc(var(--radius-lg))] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hoveredCardId === plan.id ? 'opacity-100' : ''}`} style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                    maskImage: 'radial-gradient(120% 120% at 50% 50%, black 30%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(120% 120% at 50% 50%, black 30%, transparent 70%)'
                  }} />
                  {isCurrentPlan && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-xs">
                        Current
                      </Badge>
                    </div>
                  )}

                <CardHeader className="text-center pt-3 pb-2">
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm bg-white/5 border border-white/20">
                      {plan.id === 'free' ? (
                        <Zap className="h-5 w-5 text-gray-300" />
                      ) : (
                        <Crown className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-50 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-3 space-y-1">
                    {introAmount !== null ? (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold text-gray-50">${formatCurrency(introAmount)}</span>
                          <span className="text-gray-200 text-xs">/{priceInfo.period}</span>
                        </div>
                        <p className="text-[10px] text-emerald-200/90">First week -{introDiscountPercent}% • Then {priceInfo.period}: ${formatCurrency(baseAmount)}</p>
                        <p className="text-[10px] text-gray-300">~${getDailyApprox(introAmount, priceInfo.period)} per day</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold text-gray-50">${formatCurrency(baseAmount)}</span>
                          <span className="text-gray-200 text-xs">/{priceInfo.period}</span>
                        </div>
                        <p className="text-[10px] text-gray-300">~${getDailyApprox(baseAmount, priceInfo.period)} per day</p>
                        {introDiscountPercent && isPaidPlan && billingInterval !== 'week' && (
                          <p className="text-[10px] text-emerald-200/90">First week -{introDiscountPercent}% applies</p>
                        )}
                      </>
                    )}
                    {billingInterval === 'year' && (
                      <p className="text-xs text-gray-300 mt-1">~{formatCurrency(plan.yearlyPrice / 12)}/month on yearly billing</p>
                    )}
                  </div>

                  <CardDescription className="text-gray-300 text-xs">
                    {plan.id === 'pro' && 'Solo creators: faster workflow, premium templates, essential analytics'}
                    {plan.id === 'premium' && 'Teams & power users: higher limits, advanced analytics, priority support'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-4 pb-4 flex-1 flex flex-col justify-between">
                  <ul className="space-y-2 mb-4">
                    {/* Pro details */}
                    {plan.id === 'pro' && (
                      <>
                        {[
                          'Up to 500 carousel generations/month',
                          '20+ premium templates',
                          'Pro AI styles & models',
                          'In-app Image Editor',
                          'Save custom templates',
                          'Basic analytics & insights',
                          'Export-ready image downloads',
                          'Email support'
                        ].map((text, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="h-2.5 w-2.5 text-emerald-300" />
                            </div>
                            <span className="text-xs text-gray-200 leading-relaxed">{text}</span>
                          </li>
                        ))}
                      </>
                    )}

                    {/* Premium details */}
                    {plan.id === 'premium' && (
                      <>
                        {[
                          'Up to 2,000 carousel generations/month',
                          'All premium templates & styles',
                          'Custom branding options',
                          'In-app Image Editor',
                          'Save custom templates',
                          'Advanced analytics & insights',
                          'Export-ready image downloads',
                          'Priority processing & support',
                          'Early access to new features'
                        ].map((text, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="h-2.5 w-2.5 text-emerald-300" />
                            </div>
                            <span className="text-xs text-gray-200 leading-relaxed">{text}</span>
                          </li>
                        ))}
                      </>
                    )}
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
                      <span>{introAmount !== null ? `Start – First week -${introDiscountPercent}%` : 'Get Started'}</span>
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

      {/* Mobile Sticky CTA Bar */}
      {targetPlan && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
          <div className="mx-3 mb-3 rounded-2xl bg-[rgba(2,6,23,0.7)] backdrop-blur-md border border-white/15 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-gray-300 leading-none mb-1">{targetPlan.name}</p>
                {(() => {
                  const priceInfo = getPlanPrice(targetPlan)
                  const baseAmount = priceInfo.amount
                  const isPaidPlan = targetPlan.id !== 'free'
                  const introAmount = introDiscountPercent && isPaidPlan
                    ? Number((baseAmount * (1 - introDiscountPercent / 100)).toFixed(2))
                    : null
                  return (
                    <div className="text-gray-100">
                      {introAmount !== null ? (
                        <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
                          <span className="text-base font-semibold">${formatCurrency(introAmount)}</span>
                          <span className="text-[11px] text-gray-300">/{priceInfo.period}</span>
                          <span className="text-[10px] text-emerald-200/90">• Intro -{introDiscountPercent}%</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5">
                          <span className="text-base font-semibold">${formatCurrency(baseAmount)}</span>
                          <span className="text-[11px] text-gray-300">/{priceInfo.period}</span>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
              <div className="shrink-0">
                <Button
                  size="sm"
                  className="h-9 text-xs px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg border-0"
                  onClick={() => handlePlanSelect(targetPlan)}
                  disabled={loading === targetPlan.id}
                >
                  {loading === targetPlan.id ? 'Processing…' : introDiscountPercent ? `Start – Intro -${introDiscountPercent}%` : 'Get Started'}
                </Button>
              </div>
            </div>
          </div>
          {/* Safe area spacer */}
          <div className="h-2" />
        </div>
      )}
    </div>
  )
} 