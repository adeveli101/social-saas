import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { getUserCurrentPlan } from '@/lib/clerk'
import { canUseFeature, type SubscriptionPlan } from '@/lib/plans'

type PlanId = 'free' | 'pro' | 'premium'

const PLAN_ORDER: Record<PlanId, number> = { free: 0, pro: 1, premium: 2 }

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ hasAccess: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { feature, requiredPlan } = await request.json().catch(() => ({})) as {
      feature?: string
      requiredPlan?: PlanId
    }

    const supabase = await createClient()
    const currentPlan = (await getUserCurrentPlan(userId, supabase)) as PlanId | 'free'

    let hasAccess = true

    if (requiredPlan && PLAN_ORDER[requiredPlan as PlanId] !== undefined) {
      const current = PLAN_ORDER[(currentPlan as PlanId) || 'free'] ?? 0
      const required = PLAN_ORDER[requiredPlan]
      hasAccess = current >= required
    } else if (feature) {
      hasAccess = canUseFeature((currentPlan as PlanId) || 'free', feature)
    }

    return NextResponse.json({ hasAccess, plan: currentPlan })
  } catch (error) {
    console.error('Error checking access:', error)
    return NextResponse.json({ hasAccess: false, error: 'Internal server error' }, { status: 500 })
  }
}


