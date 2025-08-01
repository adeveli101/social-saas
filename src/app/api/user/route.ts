import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { auth } from '@clerk/nextjs/server'

// GET /api/user
// Get user profile and plan
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, plan, credits')
    if (error) throw error
    return new NextResponse(JSON.stringify(data), { status: 200 })
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// POST /api/user
// Create or update user profile
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, email, fullName } = body

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'User ID is required' }), { status: 400 })
    }

    const supabase = await createClient()

    // Check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id, full_name, email, plan, credits')
      .eq('id', userId)
    if (findError) throw findError

    if (existingUser && existingUser.length > 0) {
      // User exists, update
      const { error: updateError } = await supabase
        .from('users')
        .update({ full_name: fullName, email: email })
        .eq('id', userId)
      if (updateError) throw updateError
      return new NextResponse(JSON.stringify({ message: 'User updated' }), { status: 200 })
    } else {
      // User does not exist, create
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: userId, full_name: fullName, email: email })
      if (insertError) throw insertError
      return new NextResponse(JSON.stringify({ message: 'User created' }), { status: 201 })
    }
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  }
} 