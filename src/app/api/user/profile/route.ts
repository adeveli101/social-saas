import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, username } = body

    // Validate input
    if (!firstName && !lastName && !username) {
      return NextResponse.json({ error: 'At least one field is required' }, { status: 400 })
    }

    // Update user profile via Clerk
    const updateData: any = {}
    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (username !== undefined && username.trim()) updateData.username = username.trim()

    const updatedUser = await (await clerkClient()).users.updateUser(userId, updateData)

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.fullName,
        emailAddresses: updatedUser.emailAddresses,
        imageUrl: updatedUser.imageUrl
      }
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
