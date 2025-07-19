import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  services: {
    database: {
      status: 'healthy' | 'unhealthy'
      responseTime?: number
      error?: string
    }
    ai_services: {
      openai: {
        status: 'healthy' | 'unhealthy'
        error?: string
      }
      gemini: {
        status: 'healthy' | 'unhealthy'
        error?: string
      }
    }
    storage: {
      status: 'healthy' | 'unhealthy'
      error?: string
    }
    queue: {
      status: 'healthy' | 'unhealthy'
      pending_jobs?: number
      error?: string
    }
  }
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: { status: 'unhealthy' },
      ai_services: {
        openai: { status: 'unhealthy' },
        gemini: { status: 'unhealthy' }
      },
      storage: { status: 'unhealthy' },
      queue: { status: 'unhealthy' }
    },
    uptime: process.uptime(),
    memory: {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
      percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100
    }
  }

  try {
    // Test database connection
    const dbStartTime = Date.now()
    const { data: dbTest, error: dbError } = await supabase
      .from('generation_jobs')
      .select('count')
      .limit(1)

    const dbResponseTime = Date.now() - dbStartTime

    if (dbError) {
      healthStatus.services.database = {
        status: 'unhealthy',
        error: dbError.message
      }
    } else {
      healthStatus.services.database = {
        status: 'healthy',
        responseTime: dbResponseTime
      }
    }

    // Test AI services (basic connectivity)
    try {
      // Test OpenAI API key (without making actual calls)
      if (process.env.OPENAI_API_KEY) {
        healthStatus.services.ai_services.openai = { status: 'healthy' }
      } else {
        healthStatus.services.ai_services.openai = {
          status: 'unhealthy',
          error: 'OpenAI API key not configured'
        }
      }
    } catch (error) {
      healthStatus.services.ai_services.openai = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    try {
      // Test Gemini API key (without making actual calls)
      if (process.env.GOOGLE_GEMINI_API_KEY) {
        healthStatus.services.ai_services.gemini = { status: 'healthy' }
      } else {
        healthStatus.services.ai_services.gemini = {
          status: 'unhealthy',
          error: 'Gemini API key not configured'
        }
      }
    } catch (error) {
      healthStatus.services.ai_services.gemini = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test storage connection
    try {
      const { data: storageTest, error: storageError } = await supabase.storage
        .listBuckets()

      if (storageError) {
        healthStatus.services.storage = {
          status: 'unhealthy',
          error: storageError.message
        }
      } else {
        healthStatus.services.storage = { status: 'healthy' }
      }
    } catch (error) {
      healthStatus.services.storage = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test queue status
    try {
      const { data: queueStats, error: queueError } = await supabase
        .from('generation_jobs')
        .select('status')
        .eq('status', 'pending')

      if (queueError) {
        healthStatus.services.queue = {
          status: 'unhealthy',
          error: queueError.message
        }
      } else {
        healthStatus.services.queue = {
          status: 'healthy',
          pending_jobs: queueStats?.length || 0
        }
      }
    } catch (error) {
      healthStatus.services.queue = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Determine overall health status
    const allServices = [
      healthStatus.services.database.status,
      healthStatus.services.ai_services.openai.status,
      healthStatus.services.ai_services.gemini.status,
      healthStatus.services.storage.status,
      healthStatus.services.queue.status
    ]

    const unhealthyCount = allServices.filter(status => status === 'unhealthy').length

    if (unhealthyCount === 0) {
      healthStatus.status = 'healthy'
    } else if (unhealthyCount <= 2) {
      healthStatus.status = 'degraded'
    } else {
      healthStatus.status = 'unhealthy'
    }

    const responseTime = Date.now() - startTime

    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'unhealthy' ? 503 : 200,
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    healthStatus.status = 'unhealthy'
    healthStatus.services.database = {
      status: 'unhealthy',
      error: 'Health check failed'
    }

    return NextResponse.json(healthStatus, {
      status: 503,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

export async function HEAD() {
  // Lightweight health check for load balancers
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Health-Check': 'ok',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
} 