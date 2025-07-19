import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { QueueManager } from '@/lib/queue'
import { JobStatus, JobType, JobPriority } from '@/types/queue-system'

// Test environment configuration
const TEST_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const TEST_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-key'

// Test Supabase client
export const testSupabase = createClient<Database>(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY)

// Test Queue Manager instance
export const testQueueManager = new QueueManager(testSupabase)

// Test user data
export const TEST_USER_ID = 'test-user-123'
export const TEST_USER_EMAIL = 'test@example.com'

// Mock job data for testing
export const mockJobData = {
  user_id: TEST_USER_ID,
  job_type: JobType.CAROUSEL_GENERATION,
  priority: JobPriority.NORMAL,
  payload: {
    prompt: 'Test carousel prompt',
    style: 'modern',
    aspectRatio: '16:9',
    keyPoints: ['Point 1', 'Point 2', 'Point 3']
  },
  scheduled_at: new Date().toISOString()
}

// Mock carousel data for testing
export const mockCarouselData = {
  user_id: TEST_USER_ID,
  title: 'Test Carousel',
  description: 'Test carousel description',
  style: 'modern',
  aspect_ratio: '16:9',
  status: 'generating',
  progress_percent: 0,
  progress_message: 'Starting generation...'
}

/**
 * Database test helpers
 */
export class DatabaseTestHelpers {
  /**
   * Clean up test data
   */
  static async cleanupTestData() {
    try {
      // Clean up generation_jobs
      await testSupabase
        .from('generation_jobs')
        .delete()
        .eq('user_id', TEST_USER_ID)

      // Clean up carousels
      await testSupabase
        .from('carousels')
        .delete()
        .eq('user_id', TEST_USER_ID)

      console.log('✅ Test data cleaned up successfully')
    } catch (error) {
      console.error('❌ Error cleaning up test data:', error)
    }
  }

  /**
   * Create a test job
   */
  static async createTestJob(jobData: Partial<typeof mockJobData> = {}) {
    const job = {
      ...mockJobData,
      ...jobData
    }

    const { data, error } = await testQueueManager.createJob(job)
    
    if (error) {
      throw new Error(`Failed to create test job: ${error.message}`)
    }

    return data
  }

  /**
   * Create a test carousel
   */
  static async createTestCarousel(carouselData: Partial<typeof mockCarouselData> = {}) {
    const carousel = {
      ...mockCarouselData,
      ...carouselData
    }

    const { data, error } = await testSupabase
      .from('carousels')
      .insert(carousel)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create test carousel: ${error.message}`)
    }

    return data
  }

  /**
   * Get job by ID
   */
  static async getJobById(jobId: string) {
    const { data, error } = await testQueueManager.getJobById(jobId)
    
    if (error) {
      throw new Error(`Failed to get job: ${error.message}`)
    }

    return data
  }

  /**
   * Update job status
   */
  static async updateJobStatus(jobId: string, status: JobStatus, progress?: number) {
    const { data, error } = await testQueueManager.updateJobStatus(jobId, status, progress)
    
    if (error) {
      throw new Error(`Failed to update job status: ${error.message}`)
    }

    return data
  }

  /**
   * Get user's jobs
   */
  static async getUserJobs(userId: string = TEST_USER_ID) {
    const { data, error } = await testQueueManager.getUserJobs(userId)
    
    if (error) {
      throw new Error(`Failed to get user jobs: ${error.message}`)
    }

    return data
  }

  /**
   * Get pending jobs
   */
  static async getPendingJobs() {
    const { data, error } = await testQueueManager.getPendingJobs()
    
    if (error) {
      throw new Error(`Failed to get pending jobs: ${error.message}`)
    }

    return data
  }
}

/**
 * Mock job creation utilities
 */
export class MockJobHelpers {
  /**
   * Create a mock job with specific status
   */
  static async createMockJobWithStatus(status: JobStatus, progress: number = 0) {
    const job = await DatabaseTestHelpers.createTestJob()
    
    await DatabaseTestHelpers.updateJobStatus(job.id, status, progress)
    
    return await DatabaseTestHelpers.getJobById(job.id)
  }

  /**
   * Create multiple mock jobs
   */
  static async createMultipleMockJobs(count: number, status: JobStatus = JobStatus.PENDING) {
    const jobs = []
    
    for (let i = 0; i < count; i++) {
      const job = await DatabaseTestHelpers.createTestJob({
        payload: {
          ...mockJobData.payload,
          prompt: `Test carousel prompt ${i + 1}`
        }
      })
      
      if (status !== JobStatus.PENDING) {
        await DatabaseTestHelpers.updateJobStatus(job.id, status)
      }
      
      jobs.push(job)
    }
    
    return jobs
  }

  /**
   * Create a completed job with results
   */
  static async createCompletedJobWithResults() {
    const job = await DatabaseTestHelpers.createTestJob()
    
    const result = {
      carousel_id: 'test-carousel-123',
      images: [
        { url: 'https://example.com/image1.jpg', caption: 'Test image 1' },
        { url: 'https://example.com/image2.jpg', caption: 'Test image 2' },
        { url: 'https://example.com/image3.jpg', caption: 'Test image 3' }
      ],
      final_caption: 'Test final caption',
      processing_time: 5000,
      cost: 0.15
    }
    
    await testQueueManager.updateJobResult(job.id, result)
    await DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.COMPLETED, 100)
    
    return await DatabaseTestHelpers.getJobById(job.id)
  }
}

/**
 * Cleanup functions
 */
export class CleanupHelpers {
  /**
   * Clean up all test data
   */
  static async cleanupAll() {
    await DatabaseTestHelpers.cleanupTestData()
    console.log('✅ All test data cleaned up')
  }

  /**
   * Clean up specific job
   */
  static async cleanupJob(jobId: string) {
    try {
      await testQueueManager.deleteJob(jobId)
      console.log(`✅ Job ${jobId} cleaned up`)
    } catch (error) {
      console.error(`❌ Error cleaning up job ${jobId}:`, error)
    }
  }

  /**
   * Clean up specific carousel
   */
  static async cleanupCarousel(carouselId: string) {
    try {
      await testSupabase
        .from('carousels')
        .delete()
        .eq('id', carouselId)
      
      console.log(`✅ Carousel ${carouselId} cleaned up`)
    } catch (error) {
      console.error(`❌ Error cleaning up carousel ${carouselId}:`, error)
    }
  }
}

/**
 * Test assertions
 */
export class TestAssertions {
  /**
   * Assert job has expected status
   */
  static assertJobStatus(job: any, expectedStatus: JobStatus) {
    if (job.status !== expectedStatus) {
      throw new Error(`Expected job status to be ${expectedStatus}, but got ${job.status}`)
    }
  }

  /**
   * Assert job has expected progress
   */
  static assertJobProgress(job: any, expectedProgress: number) {
    if (job.progress_percent !== expectedProgress) {
      throw new Error(`Expected job progress to be ${expectedProgress}, but got ${job.progress_percent}`)
    }
  }

  /**
   * Assert job has results
   */
  static assertJobHasResults(job: any) {
    if (!job.result) {
      throw new Error('Expected job to have results, but none found')
    }
  }

  /**
   * Assert job has error
   */
  static assertJobHasError(job: any) {
    if (!job.error) {
      throw new Error('Expected job to have error, but none found')
    }
  }

  /**
   * Assert carousel exists
   */
  static assertCarouselExists(carouselId: string) {
    return testSupabase
      .from('carousels')
      .select('id')
      .eq('id', carouselId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          throw new Error(`Carousel ${carouselId} does not exist`)
        }
      })
  }
}

/**
 * Test setup and teardown utilities
 */
export class TestSetup {
  /**
   * Setup test environment
   */
  static async setup() {
    console.log('🧪 Setting up test environment...')
    await DatabaseTestHelpers.cleanupTestData()
    console.log('✅ Test environment ready')
  }

  /**
   * Teardown test environment
   */
  static async teardown() {
    console.log('🧹 Cleaning up test environment...')
    await CleanupHelpers.cleanupAll()
    console.log('✅ Test environment cleaned up')
  }
}

// Export all utilities for easy import
export {
  testSupabase,
  testQueueManager,
  TEST_USER_ID,
  TEST_USER_EMAIL,
  mockJobData,
  mockCarouselData
} 