import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface MonitoringData {
  timestamp: string
  system: {
    uptime: number
    memory: {
      used: number
      total: number
      percentage: number
    }
    cpu: {
      load: number
    }
  }
  queue: {
    total_jobs: number
    pending_jobs: number
    processing_jobs: number
    completed_jobs: number
    failed_jobs: number
    average_processing_time: number
  }
  ai_services: {
    openai: {
      total_requests: number
      successful_requests: number
      failed_requests: number
      average_response_time: number
      total_cost: number
    }
    gemini: {
      total_requests: number
      successful_requests: number
      failed_requests: number
      average_response_time: number
      total_cost: number
    }
  }
  storage: {
    total_files: number
    total_size: number
    average_file_size: number
  }
  users: {
    total_users: number
    active_users_24h: number
    new_users_24h: number
  }
  performance: {
    average_response_time: number
    requests_per_minute: number
    error_rate: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const monitoringData: MonitoringData = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100
        },
        cpu: {
          load: 0 // Would need additional monitoring for CPU load
        }
      },
      queue: {
        total_jobs: 0,
        pending_jobs: 0,
        processing_jobs: 0,
        completed_jobs: 0,
        failed_jobs: 0,
        average_processing_time: 0
      },
      ai_services: {
        openai: {
          total_requests: 0,
          successful_requests: 0,
          failed_requests: 0,
          average_response_time: 0,
          total_cost: 0
        },
        gemini: {
          total_requests: 0,
          successful_requests: 0,
          failed_requests: 0,
          average_response_time: 0,
          total_cost: 0
        }
      },
      storage: {
        total_files: 0,
        total_size: 0,
        average_file_size: 0
      },
      users: {
        total_users: 0,
        active_users_24h: 0,
        new_users_24h: 0
      },
      performance: {
        average_response_time: 0,
        requests_per_minute: 0,
        error_rate: 0
      }
    }

    // Get queue statistics
    try {
      const { data: queueStats, error: queueError } = await supabase
        .from('generation_jobs')
        .select('status, created_at, completed_at, started_at')

      if (!queueError && queueStats) {
        const now = new Date()
        const jobs = queueStats

        monitoringData.queue = {
          total_jobs: jobs.length,
          pending_jobs: jobs.filter(job => job.status === 'pending').length,
          processing_jobs: jobs.filter(job => job.status === 'processing').length,
          completed_jobs: jobs.filter(job => job.status === 'completed').length,
          failed_jobs: jobs.filter(job => job.status === 'failed').length,
          average_processing_time: calculateAverageProcessingTime(jobs)
        }
      }
    } catch (error) {
      console.error('Error fetching queue stats:', error)
    }

    // Get user statistics
    try {
      const { data: userStats, error: userError } = await supabase
        .from('users')
        .select('created_at')

      if (!userError && userStats) {
        const now = new Date()
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        const activeUsers = userStats.filter(user => 
          new Date(user.created_at) > twentyFourHoursAgo
        ).length

        const newUsers = userStats.filter(user => 
          new Date(user.created_at) > twentyFourHoursAgo
        ).length

        monitoringData.users = {
          total_users: userStats.length,
          active_users_24h: activeUsers,
          new_users_24h: newUsers
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }

    // Get storage statistics
    try {
      const { data: storageBuckets, error: storageError } = await supabase.storage
        .listBuckets()

      if (!storageError && storageBuckets) {
        let totalFiles = 0
        let totalSize = 0

        for (const bucket of storageBuckets) {
          if (bucket.name === 'carousel-images') {
            const { data: files } = await supabase.storage
              .from(bucket.name)
              .list()

            if (files) {
              totalFiles += files.length
              totalSize += files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
            }
          }
        }

        monitoringData.storage = {
          total_files: totalFiles,
          total_size: totalSize,
          average_file_size: totalFiles > 0 ? totalSize / totalFiles : 0
        }
      }
    } catch (error) {
      console.error('Error fetching storage stats:', error)
    }

    // Calculate performance metrics (simplified)
    monitoringData.performance = {
      average_response_time: 200, // Mock value
      requests_per_minute: 10, // Mock value
      error_rate: 0.01 // Mock value
    }

    return NextResponse.json(monitoringData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Monitoring-Timestamp': monitoringData.timestamp
      }
    })

  } catch (error) {
    console.error('Monitoring error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    )
  }
}

function calculateAverageProcessingTime(jobs: any[]): number {
  const completedJobs = jobs.filter(job => 
    job.status === 'completed' && job.started_at && job.completed_at
  )

  if (completedJobs.length === 0) return 0

  const totalTime = completedJobs.reduce((sum, job) => {
    const startTime = new Date(job.started_at).getTime()
    const endTime = new Date(job.completed_at).getTime()
    return sum + (endTime - startTime)
  }, 0)

  return totalTime / completedJobs.length
}

export async function POST(request: NextRequest) {
  // Endpoint for receiving monitoring data from external sources
  try {
    const data = await request.json()
    
    // Log monitoring data for analysis
    console.log('Monitoring data received:', JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing monitoring data:', error)
    return NextResponse.json(
      { error: 'Failed to process monitoring data' },
      { status: 500 }
    )
  }
} 