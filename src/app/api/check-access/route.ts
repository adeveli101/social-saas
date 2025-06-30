import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { canAccessFeature } from '@/lib/clerk'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { feature, requiredPlan } = body

    if (!feature) {
      return NextResponse.json({ error: 'Feature is required' }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
    const hasAccess = await canAccessFeature(feature, userId, supabase, requiredPlan)

    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 