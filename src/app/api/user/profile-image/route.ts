import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert file to base64 for Clerk
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`

    // Update user profile image in Clerk
    const client = await clerkClient()
    // Use Clerk's dedicated API to update the user's profile image
    await client.users.updateUserProfileImage(userId, {
      file: image
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading profile image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove profile image from Clerk
    const client = await clerkClient()
    await client.users.deleteUserProfileImage(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing profile image:', error)
    return NextResponse.json({ error: 'Failed to remove image' }, { status: 500 })
  }
}


