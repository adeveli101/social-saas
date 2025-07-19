import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'svix'
import { headers } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    
    // Verify webhook signature
    const svix_id = headersList.get('svix-id')
    const svix_timestamp = headersList.get('svix-timestamp')
    const svix_signature = headersList.get('svix-signature')
    
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      )
    }

    // Verify webhook (optional for development)
    if (process.env.NODE_ENV === 'production') {
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
      try {
        wh.verify(body, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        })
      } catch (err) {
        console.error('Webhook verification failed:', err)
        return NextResponse.json(
          { error: 'Webhook verification failed' },
          { status: 400 }
        )
      }
    }

    const payload = JSON.parse(body)
    const { type, data } = payload

    console.log('Clerk webhook received:', { type, userId: data.id })

    switch (type) {
      case 'user.created':
        await handleUserCreated(data)
        break
      
      case 'user.updated':
        await handleUserUpdated(data)
        break
      
      case 'user.deleted':
        await handleUserDeleted(data)
        break
      
      default:
        console.log('Unhandled webhook type:', type)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleUserCreated(userData: any) {
  try {
    const { id, email_addresses, first_name, last_name } = userData
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', id)
      .single()

    if (existingUser) {
      console.log('User already exists:', id)
      return
    }

    // Create new user in Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        clerk_id: id,
        email: email_addresses?.[0]?.email_address || null,
        first_name: first_name || null,
        last_name: last_name || null,
        plan: 'free',
        credits: 10,
        daily_limit: 5,
        last_reset_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw error
    }

    console.log('User created successfully:', newUser.id)

  } catch (error) {
    console.error('Error in handleUserCreated:', error)
    throw error
  }
}

async function handleUserUpdated(userData: any) {
  try {
    const { id, email_addresses, first_name, last_name } = userData
    
    // Update user in Supabase
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        email: email_addresses?.[0]?.email_address || null,
        first_name: first_name || null,
        last_name: last_name || null,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw error
    }

    console.log('User updated successfully:', updatedUser.id)

  } catch (error) {
    console.error('Error in handleUserUpdated:', error)
    throw error
  }
}

async function handleUserDeleted(userData: any) {
  try {
    const { id } = userData
    
    // Delete user from Supabase (or mark as deleted)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', id)

    if (error) {
      console.error('Error deleting user:', error)
      throw error
    }

    console.log('User deleted successfully:', id)

  } catch (error) {
    console.error('Error in handleUserDeleted:', error)
    throw error
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Clerk webhook endpoint',
    status: 'active'
  })
} 