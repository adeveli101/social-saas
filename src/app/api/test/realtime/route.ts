import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { jobId, action } = await request.json()

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'update_progress':
        // Update job progress
        const { data: jobUpdate, error: jobError } = await supabase
          .from('generation_jobs')
          .update({
            progress_percent: 50,
            progress_message: 'Testing real-time updates...',
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId)
          .select()

        if (jobError) {
          return NextResponse.json(
            { error: 'Failed to update job', details: jobError },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Job progress updated',
          data: jobUpdate
        })

      case 'complete_job':
        // Complete the job with mock results
        const mockResult = {
          carousel_id: jobId,
          slides: [
            {
              image_url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Test+Slide+1',
              caption: 'Test slide 1 - Real-time updates working!'
            },
            {
              image_url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Test+Slide+2',
              caption: 'Test slide 2 - Real-time updates working!'
            }
          ],
          final_caption: 'Test carousel with real-time updates',
          processing_time: 5000,
          cost: 0.15
        }

        const { data: jobComplete, error: completeError } = await supabase
          .from('generation_jobs')
          .update({
            status: 'completed',
            progress_percent: 100,
            progress_message: 'Generation completed!',
            result: mockResult,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId)
          .select()

        if (completeError) {
          return NextResponse.json(
            { error: 'Failed to complete job', details: completeError },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Job completed',
          data: jobComplete
        })

      case 'fail_job':
        // Fail the job
        const { data: jobFail, error: failError } = await supabase
          .from('generation_jobs')
          .update({
            status: 'failed',
            progress_percent: 0,
            error: {
              message: 'Test error - Real-time error handling working!',
              code: 'TEST_ERROR',
              details: 'This is a test error for real-time subscription testing'
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId)
          .select()

        if (failError) {
          return NextResponse.json(
            { error: 'Failed to update job status', details: failError },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Job failed',
          data: jobFail
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: update_progress, complete_job, or fail_job' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Real-time test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Real-time test endpoint',
    usage: {
      POST: {
        body: {
          jobId: 'string (required)',
          action: 'update_progress | complete_job | fail_job (required)'
        }
      }
    }
  })
} 