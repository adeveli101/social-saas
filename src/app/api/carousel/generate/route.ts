import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateCarousel } from '@/lib/carousel'

// POST /api/carousel/generate
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { prompt, imageCount } = body

    if (!prompt || !imageCount) {
      return NextResponse.json(
        { error: 'Prompt ve imageCount gerekli' },
        { status: 400 }
      )
    }

    const carouselId = await generateCarousel({
      prompt,
      imageCount,
      userId
    })

    return NextResponse.json({ id: carouselId })
  } catch (error) {
    console.error('Carousel generation error:', error)
    return NextResponse.json(
      { error: 'Carousel oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
} 