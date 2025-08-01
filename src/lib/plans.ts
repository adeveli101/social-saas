// AI Carousel Studio Subscription Plans
export interface SubscriptionPlan {
  id: string
  name: string
  monthlyPrice: number
  weeklyPrice: number
  yearlyPrice: number
  features: string[]
  stripePriceId?: {
    weekly?: string
    monthly?: string
    yearly?: string
  }
  limits: {
    carousels: number | 'unlimited'
    slides: number | 'unlimited'
    downloads: number | 'unlimited'
    templates: number | 'unlimited'
  }
  popular?: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

// AI Carousel Studio Plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 9.9,
    weeklyPrice: 3.5,
    yearlyPrice: 79, // ~33% discount from monthly
    features: [
      '50 carousel generations per month',
      'Access to 5 basic templates',
      'Standard AI styles',
      'Basic content storage (100 MB)',
      'Email support'
    ],
    limits: {
      carousels: 50,
      slides: 500,
      downloads: 100,
      templates: 5
    }
  },
  {
    id: 'creator',
    name: 'Creator',
    monthlyPrice: 19.9,
    weeklyPrice: 6.5,
    yearlyPrice: 179, // ~25% discount from monthly
    popular: true,
    stripePriceId: {
      weekly: 'price_creator_weekly',
      monthly: 'price_creator_monthly',
      yearly: 'price_creator_yearly'
    },
    features: [
      '500 carousel generations per month',
      'Access to 50+ premium templates',
      'All premium AI styles',
      'Extended content storage (5 GB)',
      'Early access to new features',
      'Priority support'
    ],
    limits: {
      carousels: 500,
      slides: 5000,
      downloads: 1000,
      templates: 50
    }
  }
]

// Export PLANS for backward compatibility
export const PLANS = SUBSCRIPTION_PLANS

// Feature limits checker
export function getFeatureLimit(planId: string, feature: keyof SubscriptionPlan['limits']): number | 'unlimited' {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  return plan?.limits[feature] || 0
}

// Check if user can access feature
export function canUseFeature(planId: string, feature: string): boolean {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  if (!plan) return false
  
  switch (feature) {
    case 'advanced_styles':
      return plan.id === 'creator'
    case 'concurrent_generations':
      return true
    case 'early_access':
      return plan.id === 'creator'
    default:
      return true
  }
} 