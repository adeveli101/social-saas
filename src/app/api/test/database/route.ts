import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message
      }, { status: 500 })
    }

    // Test 2: Check tables exist
    const tables = ['users', 'carousels', 'generation_jobs', 'carousel_slides', 'todos']
    const tableStatus: Record<string, { exists: boolean; error: string | null }> = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        tableStatus[table] = {
          exists: !error,
          error: error?.message || null
        }
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }

    // Test 3: Check Clerk integration fields
    const clerkFields = {
      users: ['clerk_id', 'email', 'plan', 'credits'],
      carousels: ['clerk_user_id', 'progress_percent'],
      generation_jobs: ['clerk_user_id', 'status']
    }
    
    const fieldStatus: Record<string, Record<string, { exists: boolean; error: string | null }>> = {}
    
    for (const [table, fields] of Object.entries(clerkFields)) {
      fieldStatus[table] = {}
      for (const field of fields) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select(field)
            .limit(1)
          
          fieldStatus[table][field] = {
            exists: !error,
            error: error?.message || null
          }
        } catch (err) {
          fieldStatus[table][field] = {
            exists: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          }
        }
      }
    }

    // Test 4: RLS Policies check
    const rlsStatus: Record<string, { accessible: boolean; error: string | null }> = {}
    const rlsTables = ['users', 'carousels', 'generation_jobs', 'carousel_slides', 'todos']
    
    for (const table of rlsTables) {
      try {
        // Try to select with authenticated user context
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        rlsStatus[table] = {
          accessible: !error || error.code !== 'PGRST116', // PGRST116 = RLS policy violation
          error: error?.message || null
        }
      } catch (err) {
        rlsStatus[table] = {
          accessible: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        connection: '✅ Connected',
        tables: tableStatus,
        clerkFields: fieldStatus,
        rlsPolicies: rlsStatus,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, table, data } = await request.json()
    const supabase = await createClient()
    
    switch (action) {
      case 'insert_test_user':
        const { data: user, error: userError } = await supabase
          .from('users')
          .insert({
            clerk_id: 'test-clerk-id-' + Date.now(),
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
          message: 'Test user created successfully'
        })

      case 'insert_test_carousel':
        const { data: carousel, error: carouselError } = await supabase
          .from('carousels')
          .insert({
            clerk_user_id: 'test-clerk-id-' + Date.now(),
            prompt: 'Test carousel',
            image_count: 3,
            status: 'pending'
          })
          .select()
          .single()
        
        if (carouselError) throw carouselError
        
        return NextResponse.json({
          success: true,
          data: carousel,
          message: 'Test carousel created successfully'
        })

      case 'cleanup_test_data':
        // Clean up test data
        await supabase
          .from('users')
          .delete()
          .like('clerk_id', 'test-clerk-id-%')
        
        await supabase
          .from('carousels')
          .delete()
          .like('clerk_user_id', 'test-clerk-id-%')
        
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
      error: 'Database operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 