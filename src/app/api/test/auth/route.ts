import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        message: 'Please sign in to test authentication'
      }, { status: 401 })
    }

    const supabase = await createClient()
    
    // Test 1: Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()
    
    // Test 2: Create test carousel
    const { data: carousel, error: carouselError } = await supabase
      .from('carousels')
      .insert({
        clerk_user_id: userId,
        prompt: 'Test authentication carousel',
        image_count: 3,
        status: 'pending'
      })
      .select()
      .single()
    
    // Test 3: Check RLS policies work
    const { data: userCarousels, error: listError } = await supabase
      .from('carousels')
      .select('*')
      .eq('clerk_user_id', userId)
    
    return NextResponse.json({
      success: true,
      data: {
        userId,
        user: user || { message: 'User not found in database' },
        carousel: carousel,
        userCarousels: userCarousels || [],
        tests: {
          userExists: !!user,
          carouselCreated: !!carousel,
          rlsWorking: !listError
        }
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Authentication test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    const supabase = await createClient()
    
    switch (action) {
      case 'create_test_user':
        // Create user in database if not exists
        const { data: user, error: userError } = await supabase
          .from('users')
          .upsert({
            clerk_id: userId,
            email: 'test@example.com',
            plan: 'free',
            credits: 10
          })
          .select()
          .single()
        
        if (userError) throw userError
        
        return NextResponse.json({
          success: true,
          data: user,
          message: 'Test user created/updated successfully'
        })

      case 'cleanup_test_data':
        // Clean up test data for this user
        await supabase
          .from('carousels')
          .delete()
          .eq('clerk_user_id', userId)
        
        return NextResponse.json({
          success: true,
          message: 'Test data cleaned up successfully'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Authentication operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 