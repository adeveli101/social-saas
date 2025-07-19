import { NextResponse } from 'next/server'
import { JobProcessor } from '@/lib/queue/job-processor'

// =============================================================================
// Job Processor API - Trigger background job processing
// =============================================================================

export async function POST(request: Request) {
  // Verify API key for security
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.QUEUE_PROCESSOR_SECRET
  
  if (!expectedSecret) {
    console.error('QUEUE_PROCESSOR_SECRET not configured')
    return NextResponse.json(
      { success: false, error: 'CONFIGURATION_ERROR', message: 'Processor not configured' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED', message: 'Invalid API key' },
      { status: 401 }
    )
  }

  try {
    const processor = new JobProcessor()
    let processed = 0
    
    // Process up to 5 jobs in this batch
    for (let i = 0; i < 5; i++) {
      const hasJob = await processor.processNextJob()
      if (hasJob) {
        processed++
      } else {
        break // No more jobs to process
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        processed,
        timestamp: new Date().toISOString(),
        message: processed > 0 ? `Processed ${processed} jobs` : 'No jobs to process'
      }
    })

  } catch (error) {
    console.error('Job processing error:', error)
    return NextResponse.json(
      { success: false, error: 'PROCESSING_ERROR', message: 'Failed to process jobs' },
      { status: 500 }
    )
  }
}

// =============================================================================
// GET endpoint for monitoring processor status
// =============================================================================

export async function GET(request: Request) {
  // Verify API key for security
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.QUEUE_PROCESSOR_SECRET
  
  if (!expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'CONFIGURATION_ERROR', message: 'Processor not configured' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED', message: 'Invalid API key' },
      { status: 401 }
    )
  }

  try {
    const processor = new JobProcessor()
    const state = processor.getProcessingState()
    
    return NextResponse.json({
      success: true,
      data: {
        isProcessing: state.isProcessing,
        isRunning: state.isRunning,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Processor status check error:', error)
    return NextResponse.json(
      { success: false, error: 'STATUS_CHECK_ERROR', message: 'Failed to check processor status' },
      { status: 500 }
    )
  }
} 