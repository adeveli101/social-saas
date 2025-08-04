import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { QueueManager } from '@/lib/queue'

// =============================================================================
// Enhanced Carousel API with Progress Tracking
// =============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'MISSING_CAROUSEL_ID', message: 'Carousel ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get carousel data with enhanced progress tracking
    const { data: carousel, error } = await supabase
      .from('carousels')
      .select(`
        *,
        carousel_slides (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Carousel fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'FETCH_ERROR', message: 'Failed to fetch carousel' },
        { status: 500 }
      )
    }

    if (!carousel) {
      return NextResponse.json(
        { success: false, error: 'CAROUSEL_NOT_FOUND', message: 'Carousel not found' },
        { status: 404 }
      )
    }

    // Check user ownership
    if (carousel.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'Access denied' },
        { status: 403 }
      )
    }

    // Get associated job information if carousel is still processing
    let jobInfo = null
    if (carousel.status === 'pending' || carousel.status === 'processing') {
      try {
        const queueManager = new QueueManager()
        const { data: jobs } = await supabase
          .from('generation_jobs')
          .select('id, status, error_message, retry_count, created_at')
          .eq('carousel_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (jobs) {
          jobInfo = {
            id: jobs.id,
            status: jobs.status,
            error: jobs.error_message,
            retryCount: jobs.retry_count,
            createdAt: jobs.created_at
          }
        }
      } catch (jobError) {
        console.error('Error fetching job info:', jobError)
        // Don't fail the request if job info can't be fetched
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...carousel,
        jobInfo,
        progress: {
          percent: carousel.progress_percent || 0,
          message: carousel.progress_message || '',
          estimatedCompletion: carousel.estimated_completion_time
        }
      }
    })
  } catch (error) {
    console.error('Carousel API error:', error)
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 }
    )
  }
} 