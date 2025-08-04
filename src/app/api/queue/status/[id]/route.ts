import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

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
        { success: false, error: 'MISSING_JOB_ID', message: 'Job ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get job status
    const { data: job, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Job status fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'FETCH_ERROR', message: 'Failed to fetch job status' },
        { status: 500 }
      )
    }

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'JOB_NOT_FOUND', message: 'Job not found' },
        { status: 404 }
      )
    }

    // Check user ownership
    if (job.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        progress: job.progress_percent || 0,
        message: job.progress_message || '',
        error: job.error_message,
        retryCount: job.retry_count,
        createdAt: job.created_at,
        updatedAt: job.updated_at
      }
    })
  } catch (error) {
    console.error('Job status API error:', error)
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 }
    )
  }
} 