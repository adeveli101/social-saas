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
    id: 'free',
    name: 'Free Plan',
    monthlyPrice: 0,
    weeklyPrice: 0,
    yearlyPrice: 0,
    features: [
      '10 carousel generations per month',
      'Access to 3 basic templates',
      'Standard AI styles',
      'Basic content storage (50 MB)',
      'Community support'
    ],
    limits: {
      carousels: 10,
      slides: 50,
      downloads: 10,
      templates: 3
    }
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    monthlyPrice: 19.99,
    weeklyPrice: 5.99,
    yearlyPrice: 199, // ~17% discount from monthly
    popular: true,
    stripePriceId: {
      weekly: 'price_pro_weekly',
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly'
    },
    features: [
      'Up to 500 carousel generations per month',
      'Access to 20+ premium templates',
      'Pro AI styles & models',
      
      'Basic analytics & insights',
      'In-app Image Editor',
      'Save custom templates',
      'Email support'
    ],
    limits: {
      carousels: 500,
      slides: 2500,
      downloads: 500,
      templates: 20
    }
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    monthlyPrice: 39.99,
    weeklyPrice: 11.99,
    yearlyPrice: 399, // ~17% discount from monthly
    stripePriceId: {
      weekly: 'price_premium_weekly',
      monthly: 'price_premium_monthly',
      yearly: 'price_premium_yearly'
    },
    features: [
      'Up to 2,000 carousel generations per month',
      'Access to all premium templates',
      'All premium AI styles & models',
      
      'Priority processing & support',
      'Early access to new features',
      'Custom branding options',
      'Advanced analytics & insights'
    ],
    limits: {
      carousels: 2000,
      slides: 10000,
      downloads: 2000,
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
      return plan.id === 'premium'
    case 'pro_styles':
      return plan.id === 'pro' || plan.id === 'premium'
    case 'concurrent_generations':
      return plan.id === 'pro' || plan.id === 'premium'
    case 'early_access':
      return plan.id === 'premium'
    case 'custom_branding':
      return plan.id === 'premium'
    case 'analytics':
      return plan.id === 'pro' || plan.id === 'premium'
    default:
      return true
  }
}

// Get plan display name
export function getPlanDisplayName(planId: string): string {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  return plan?.name || 'Free Plan'
}

// Get plan features for display
export function getPlanFeatures(planId: string) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  if (!plan) return {
    credits: '10/month',
    dailyLimit: '5/day',
    features: ['Basic support', 'Standard models']
  }

  const credits = plan.limits.carousels === 'unlimited' 
    ? 'Unlimited' 
    : `${plan.limits.carousels}/month`
    
  const dailyLimit = plan.id === 'premium'
    ? '100/day'
    : plan.id === 'pro'
      ? '50/day'
      : plan.id === 'free'
        ? '5/day'
        : '50/day'

  return {
    credits,
    dailyLimit,
    features: plan.features
  }
}

// Get plan icon type
export function getPlanIcon(planId: string): 'crown' | 'sparkles' {
  return (planId === 'pro' || planId === 'premium') ? 'crown' : 'sparkles'
}

// Get plan badge styling
export function getPlanBadgeClass(planId: string): string {
  switch (planId) {
    case 'premium':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none'
    case 'pro':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none'
    default:
      return 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'
  }
} 