import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { upgradeUserPlan, getCurrentUser } from '@/lib/clerk'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const user = await getCurrentUser(supabase)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.supabase.id,
      clerkId: user.supabase.clerk_id,
      email: user.supabase.email,
      firstName: user.supabase.first_name,
      lastName: user.supabase.last_name,
      plan: user.supabase.plan,
      credits: user.supabase.credits,
      dailyLimit: user.supabase.daily_limit,
      lastResetDate: user.supabase.last_reset_date,
      createdAt: user.supabase.created_at,
      updatedAt: user.supabase.updated_at
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const success = await upgradeUserPlan(userId, plan, supabase)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Error updating user plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

