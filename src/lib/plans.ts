// Paywall tipleri
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId?: string
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

// Paywall planları
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 social media accounts',
      'Basic analytics',
      '5 scheduled posts per month',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_pro_monthly',
    features: [
      'Unlimited social media accounts',
      'Advanced analytics',
      'Unlimited scheduled posts',
      'AI content suggestions',
      'Priority support',
      'Team collaboration'
    ]
  }
] 