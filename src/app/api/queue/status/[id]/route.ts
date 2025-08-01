import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { QueueManager } from '@/lib/queue'
import { createClient } from '@/utils/supabase/server'

// =============================================================================
// Job Status API - Get real-time status of specific job
// =============================================================================

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!params.id) {
      return NextResponse.json(
        { success: false, error: 'MISSING_JOB_ID', message: 'Job ID is required' },
        { status: 400 }
      )
    }

    const queueManager = new QueueManager()
    const job = await queueManager.getJob(params.id)

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'JOB_NOT_FOUND', message: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if user owns this job
    if (job.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'Access denied' },
        { status: 403 }
      )
    }

    // Get carousel progress information
    const supabase = await createClient()
    const { data: carousel, error: carouselError } = await supabase
      .from('carousels')
      .select('progress_percent, progress_message, estimated_completion_time')
      .eq('id', job.carousel_id)
      .single()

    if (carouselError) {
      console.error('Error fetching carousel progress:', carouselError)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        progress: {
          percent: carousel?.progress_percent || 0,
          message: carousel?.progress_message || 'Processing...'
        },
        createdAt: job.created_at,
        estimatedCompletion: carousel?.estimated_completion_time || job.completed_at,
        result: job.result,
        error: job.error_message,
        retryCount: job.retry_count,
        maxRetries: job.max_retries
      }
    })

  } catch (error) {
    console.error('Job status check error:', error)
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to get job status' },
      { status: 500 }
    )
  }
} 