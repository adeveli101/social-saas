import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { PLANS } from '@/lib/plans'

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', hasAccess: false }, { status: 401 })
    }

    const body = await request.json()
    const { feature, requiredPlan } = body

    if (!feature || !requiredPlan) {
      return NextResponse.json({ error: 'Feature and required plan are required' }, { status: 400 })
    }

    const supabase = createClient()
    
    const hasAccess = await canAccessFeature(feature, userId, supabase, requiredPlan)

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 