import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { PLANS } from '@/lib/plans'

// Helper function to check feature access
async function canAccessFeature(
  feature: string, 
  userId: string, 
  supabase: any, 
  requiredPlan: string
): Promise<boolean> {
  try {
    // Get user's current plan
    const { data: user, error } = await supabase
      .from('users')
      .select('plan')
      .eq('clerk_id', userId)
      .single()

    if (error || !user) {
      return false
    }

    // Check if user's plan meets requirements
    const userPlan = user.plan || 'free'
    const planIndex = PLANS.findIndex(p => p.id === userPlan)
    const requiredPlanIndex = PLANS.findIndex(p => p.id === requiredPlan)

    return planIndex >= requiredPlanIndex
  } catch (error) {
    console.error('Error checking feature access:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', hasAccess: false }, { status: 401 })
    }

    const body = await request.json()
    const { feature, requiredPlan } = body

    if (!feature || !requiredPlan) {
      return NextResponse.json({ error: 'Feature and required plan are required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const hasAccess = await canAccessFeature(feature, userId, supabase, requiredPlan)

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 