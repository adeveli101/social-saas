import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getCurrentUser, upgradeUserPlan } from '@/lib/clerk'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
    // Clerk user bilgilerini al ve Supabase'de kullanıcıyı oluştur/al
    const userData = await getCurrentUser(supabase)
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: userId,
        email: userData.clerk.emailAddresses[0]?.emailAddress,
        firstName: userData.clerk.firstName,
        lastName: userData.clerk.lastName,
        plan: userData.supabase.plan,
        createdAt: userData.supabase.created_at,
        updatedAt: userData.supabase.updated_at
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
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

    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
    // Plan güncelleme işlemi
    const success = await upgradeUserPlan(userId, plan, supabase)

    if (!success) {
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 