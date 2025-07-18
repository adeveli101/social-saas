import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { generateCarouselWithAI, saveCarouselToDB } from '@/lib/carousel'

// POST /api/carousel/generate
export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { prompt, imageCount } = body

    if (!prompt || !imageCount) {
      return NextResponse.json(
        { error: 'Prompt ve imageCount gerekli' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const { data: user } = await supabase.from('users').select('credits').eq('id', userId).single()

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: 'Kredi bitti' },
        { status: 402 }
      )
    }

    const carouselId = await generateCarouselWithAI({
      supabase,
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