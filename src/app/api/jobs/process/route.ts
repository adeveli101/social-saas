import { NextRequest, NextResponse } from 'next/server'

// Ensure Node.js runtime (not edge) for this route
export const runtime = 'nodejs'

export async function GET() {
  try {
    const envOk = Boolean(process.env.JOB_PROCESSOR_API_KEY)
    return NextResponse.json(
      { ok: true, info: 'Jobs processor endpoint. Send POST with x-job-key header to process batch.', envOk },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('GET /api/jobs/process failed:', error)
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const providedKey = request.headers.get('x-job-key') || ''
  const requiredKey = process.env.JOB_PROCESSOR_API_KEY || ''

  if (!requiredKey || providedKey !== requiredKey) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized', reason: !requiredKey ? 'MISSING_ENV' : 'BAD_HEADER' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  try {
    const { JobProcessor } = await import('@/lib/queue/job-processor')
    const processor = new JobProcessor()
    // Process a small batch each tick; tune as needed
    const processed = await processor.processBatch(10)
    return NextResponse.json({ ok: true, processed }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Job processing error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: 'Processing failed', message }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}


