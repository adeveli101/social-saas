import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { QueueManager } from '@/lib/queue'
import { createCarousel } from '@/lib/carousel'

// =============================================================================
// Enhanced Carousel Generation API with Queue System
// =============================================================================

const generateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  imageCount: z.number().min(2).max(10),
  styles: z.array(z.string()).optional(),
  aspectRatio: z.enum(['1:1', '4:5', '9:16']).optional(),
  audience: z.string().optional(),
  purpose: z.string().optional(),
  keyPoints: z.array(z.string()).optional()
})

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = generateSchema.parse(body)
    
    const supabase = createClient()
    
    // 1. Check user credits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user || user.credits <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INSUFFICIENT_CREDITS', 
          message: 'You need more credits to generate content',
          code: 402 
        },
        { status: 402 }
      )
    }

    // 2. Create carousel record
    const carouselId = await createCarousel(supabase, {
      user_id: userId,
      prompt: validatedData.prompt,
      image_count: validatedData.imageCount,
      status: 'pending',
      final_caption: null,
      error_message: null
    })

    // 3. Create job in queue
    const queueManager = new QueueManager()
    const jobId = await queueManager.createJob({
      carouselId: carouselId,
      userId: userId,
      payload: {
        prompt: validatedData.prompt,
        imageCount: validatedData.imageCount,
        styles: validatedData.styles || ['photo'],
        aspectRatio: validatedData.aspectRatio || '1:1',
        audience: validatedData.audience,
        purpose: validatedData.purpose,
        keyPoints: validatedData.keyPoints
      }
    })

    // 4. Deduct credit
    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('clerk_id', userId)

    return NextResponse.json({
      success: true,
      data: {
        carouselId: carouselId,
        jobId: jobId,
        estimatedTime: 60,
        remainingCredits: user.credits - 1
      },
      message: 'Generation started successfully'
    })

  } catch (error) {
    console.error('Carousel generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to start generation'
      },
      { status: 500 }
    )
  }
} 