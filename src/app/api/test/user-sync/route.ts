import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        message: 'Please sign in to test user sync'
      }, { status: 401 })
    }

    // Test 1: Check if user exists in Supabase
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    // Test 2: Create user if not exists
    let user = existingUser
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          email: 'user@example.com', // Will be updated by webhook
          plan: 'free',
          credits: 10
        })
        .select()
        .single()
      
      if (createError) {
        return NextResponse.json({
          success: false,
          error: 'Failed to create user',
          details: createError.message
        }, { status: 500 })
      }
      
      user = newUser
    }

    // Test 3: Create test carousel
    const { data: carousel, error: carouselError } = await supabase
      .from('carousels')
      .insert({
        clerk_user_id: userId,
        prompt: 'Test user sync carousel',
        image_count: 3,
        status: 'pending'
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      data: {
        userId,
        user,
        carousel,
        tests: {
          userExists: !!existingUser,
          userCreated: !existingUser && !!user,
          carouselCreated: !!carousel
        }
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'User sync test failed',
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

    switch (action) {
      case 'force_create_user':
        // Force create user in Supabase
        const { data: user, error: userError } = await supabase
          .from('users')
          .upsert({
            clerk_id: userId,
            email: 'user@example.com',
            plan: 'free',
            credits: 10
          })
          .select()
          .single()
        
        if (userError) throw userError
        
        return NextResponse.json({
          success: true,
          data: user,
          message: 'User created/updated successfully'
        })

      case 'test_webhook':
        // Simulate webhook call
        const webhookData = {
          type: 'user.created',
          data: {
            id: userId,
            email_addresses: [{ email_address: 'user@example.com' }],
            first_name: 'Test',
            last_name: 'User'
          }
        }
        
        // Call webhook endpoint directly
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/clerk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'svix-id': 'test-id',
            'svix-timestamp': Date.now().toString(),
            'svix-signature': 'test-signature'
          },
          body: JSON.stringify(webhookData)
        })
        
        return NextResponse.json({
          success: true,
          webhookResponse: await response.json(),
          message: 'Webhook test completed'
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
      error: 'User sync operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 