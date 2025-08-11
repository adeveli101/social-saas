import { NextRequest, NextResponse } from 'next/server'

// Ensure Node.js runtime (not edge) for this route
export const runtime = 'nodejs'

export async function GET() {
  // Convenience: allow browser GET to verify the endpoint exists
  return NextResponse.json(
    { ok: true, info: 'Jobs processor endpoint. Send POST with x-job-key header to process batch.' },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function POST(request: NextRequest) {
  const providedKey = request.headers.get('x-job-key') || ''
  const requiredKey = process.env.JOB_PROCESSOR_API_KEY || ''

  if (!requiredKey || providedKey !== requiredKey) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const { JobProcessor } = await import('@/lib/queue/job-processor')
    const processor = new JobProcessor()
    // Process a small batch each tick; tune as needed
    const processed = await processor.processBatch(10)
    return NextResponse.json({ ok: true, processed }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Job processing error:', error)
    return NextResponse.json({ ok: false, error: 'Processing failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}


