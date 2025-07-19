import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import {
  DatabaseTestHelpers,
  MockJobHelpers,
  CleanupHelpers,
  TestAssertions,
  TestSetup,
  testQueueManager,
  TEST_USER_ID,
  JobStatus,
  JobType,
  JobPriority
} from '../utils/test-helpers'

describe('Queue System Integration Tests', () => {
  beforeAll(async () => {
    await TestSetup.setup()
  })

  afterAll(async () => {
    await TestSetup.teardown()
  })

  beforeEach(async () => {
    await DatabaseTestHelpers.cleanupTestData()
  })

  afterEach(async () => {
    await DatabaseTestHelpers.cleanupTestData()
  })

  describe('Job Creation', () => {
    it('should create a new job successfully', async () => {
      // Create a test job
      const job = await DatabaseTestHelpers.createTestJob()

      // Verify job was created
      expect(job).toBeDefined()
      expect(job.id).toBeDefined()
      expect(job.user_id).toBe(TEST_USER_ID)
      expect(job.job_type).toBe(JobType.CAROUSEL_GENERATION)
      expect(job.status).toBe(JobStatus.PENDING)
      expect(job.priority).toBe(JobPriority.NORMAL)
      expect(job.progress_percent).toBe(0)
      expect(job.created_at).toBeDefined()
      expect(job.updated_at).toBeDefined()
    })

    it('should create job with custom priority', async () => {
      const job = await DatabaseTestHelpers.createTestJob({
        priority: JobPriority.HIGH
      })

      expect(job.priority).toBe(JobPriority.HIGH)
    })

    it('should create job with custom payload', async () => {
      const customPayload = {
        prompt: 'Custom test prompt',
        style: 'vintage',
        aspectRatio: '1:1',
        keyPoints: ['Custom point 1', 'Custom point 2']
      }

      const job = await DatabaseTestHelpers.createTestJob({
        payload: customPayload
      })

      expect(job.payload).toEqual(customPayload)
    })
  })

  describe('Job Retrieval', () => {
    it('should retrieve job by ID', async () => {
      // Create a job
      const createdJob = await DatabaseTestHelpers.createTestJob()

      // Retrieve the job
      const retrievedJob = await DatabaseTestHelpers.getJobById(createdJob.id)

      // Verify job data
      expect(retrievedJob).toBeDefined()
      expect(retrievedJob.id).toBe(createdJob.id)
      expect(retrievedJob.user_id).toBe(createdJob.user_id)
      expect(retrievedJob.job_type).toBe(createdJob.job_type)
    })

    it('should get user jobs', async () => {
      // Create multiple jobs for the user
      await DatabaseTestHelpers.createTestJob()
      await DatabaseTestHelpers.createTestJob()
      await DatabaseTestHelpers.createTestJob()

      // Get user jobs
      const userJobs = await DatabaseTestHelpers.getUserJobs()

      // Verify jobs
      expect(userJobs).toBeDefined()
      expect(userJobs.length).toBe(3)
      userJobs.forEach(job => {
        expect(job.user_id).toBe(TEST_USER_ID)
      })
    })

    it('should get pending jobs', async () => {
      // Create jobs with different statuses
      await DatabaseTestHelpers.createTestJob() // PENDING
      await MockJobHelpers.createMockJobWithStatus(JobStatus.PROCESSING, 50)
      await MockJobHelpers.createMockJobWithStatus(JobStatus.COMPLETED, 100)

      // Get pending jobs
      const pendingJobs = await DatabaseTestHelpers.getPendingJobs()

      // Verify only pending jobs are returned
      expect(pendingJobs).toBeDefined()
      expect(pendingJobs.length).toBe(1)
      expect(pendingJobs[0].status).toBe(JobStatus.PENDING)
    })
  })

  describe('Job Status Updates', () => {
    it('should update job status successfully', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Update status to processing
      const updatedJob = await DatabaseTestHelpers.updateJobStatus(
        job.id,
        JobStatus.PROCESSING,
        25
      )

      // Verify status update
      expect(updatedJob.status).toBe(JobStatus.PROCESSING)
      expect(updatedJob.progress_percent).toBe(25)
      expect(updatedJob.updated_at).toBeDefined()
    })

    it('should update job status multiple times', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Update status multiple times
      await DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.PROCESSING, 25)
      await DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.PROCESSING, 50)
      await DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.PROCESSING, 75)
      await DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.COMPLETED, 100)

      // Get final job state
      const finalJob = await DatabaseTestHelpers.getJobById(job.id)

      // Verify final state
      expect(finalJob.status).toBe(JobStatus.COMPLETED)
      expect(finalJob.progress_percent).toBe(100)
    })

    it('should handle failed job status', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Update to failed status
      const failedJob = await DatabaseTestHelpers.updateJobStatus(
        job.id,
        JobStatus.FAILED,
        0
      )

      // Verify failed status
      expect(failedJob.status).toBe(JobStatus.FAILED)
      expect(failedJob.progress_percent).toBe(0)
    })
  })

  describe('Job Results', () => {
    it('should update job with results', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Mock result data
      const result = {
        carousel_id: 'test-carousel-123',
        images: [
          { url: 'https://example.com/image1.jpg', caption: 'Test image 1' },
          { url: 'https://example.com/image2.jpg', caption: 'Test image 2' }
        ],
        final_caption: 'Test final caption',
        processing_time: 5000,
        cost: 0.15
      }

      // Update job with results
      const { data, error } = await testQueueManager.updateJobResult(job.id, result)

      expect(error).toBeNull()
      expect(data).toBeDefined()

      // Get updated job
      const updatedJob = await DatabaseTestHelpers.getJobById(job.id)

      // Verify results
      expect(updatedJob.result).toBeDefined()
      expect(updatedJob.result.carousel_id).toBe(result.carousel_id)
      expect(updatedJob.result.images).toEqual(result.images)
      expect(updatedJob.result.final_caption).toBe(result.final_caption)
    })
  })

  describe('Job Errors', () => {
    it('should handle job errors', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Mock error data
      const error = {
        message: 'Test error message',
        code: 'TEST_ERROR',
        details: 'Test error details'
      }

      // Update job with error
      const { data, error: updateError } = await testQueueManager.updateJobError(job.id, error)

      expect(updateError).toBeNull()
      expect(data).toBeDefined()

      // Get updated job
      const updatedJob = await DatabaseTestHelpers.getJobById(job.id)

      // Verify error
      expect(updatedJob.error).toBeDefined()
      expect(updatedJob.error.message).toBe(error.message)
      expect(updatedJob.error.code).toBe(error.code)
    })
  })

  describe('Queue Statistics', () => {
    it('should get queue statistics', async () => {
      // Create jobs with different statuses
      await DatabaseTestHelpers.createTestJob() // PENDING
      await DatabaseTestHelpers.createTestJob() // PENDING
      await MockJobHelpers.createMockJobWithStatus(JobStatus.PROCESSING, 50)
      await MockJobHelpers.createMockJobWithStatus(JobStatus.COMPLETED, 100)
      await MockJobHelpers.createMockJobWithStatus(JobStatus.FAILED, 0)

      // Get statistics
      const { data, error } = await testQueueManager.getQueueStatistics()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      // Verify statistics
      expect(data.total_jobs).toBe(5)
      expect(data.pending_jobs).toBe(2)
      expect(data.processing_jobs).toBe(1)
      expect(data.completed_jobs).toBe(1)
      expect(data.failed_jobs).toBe(1)
    })

    it('should get user statistics', async () => {
      // Create jobs for the user
      await DatabaseTestHelpers.createTestJob()
      await MockJobHelpers.createMockJobWithStatus(JobStatus.COMPLETED, 100)

      // Get user statistics
      const { data, error } = await testQueueManager.getUserStatistics(TEST_USER_ID)

      expect(error).toBeNull()
      expect(data).toBeDefined()

      // Verify user statistics
      expect(data.total_jobs).toBe(2)
      expect(data.completed_jobs).toBe(1)
      expect(data.pending_jobs).toBe(1)
    })
  })

  describe('Job Deletion', () => {
    it('should delete job successfully', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Delete the job
      const { error } = await testQueueManager.deleteJob(job.id)

      expect(error).toBeNull()

      // Verify job is deleted
      const { data, error: getError } = await testQueueManager.getJobById(job.id)
      expect(getError).toBeDefined()
      expect(data).toBeNull()
    })

    it('should handle deleting non-existent job', async () => {
      // Try to delete non-existent job
      const { error } = await testQueueManager.deleteJob('non-existent-id')

      expect(error).toBeDefined()
    })
  })

  describe('Job Priority', () => {
    it('should retrieve jobs by priority', async () => {
      // Create jobs with different priorities
      await DatabaseTestHelpers.createTestJob({ priority: JobPriority.LOW })
      await DatabaseTestHelpers.createTestJob({ priority: JobPriority.NORMAL })
      await DatabaseTestHelpers.createTestJob({ priority: JobPriority.HIGH })

      // Get jobs ordered by priority
      const { data, error } = await testQueueManager.getPendingJobs()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(3)

      // Verify priority order (HIGH should come first)
      expect(data[0].priority).toBe(JobPriority.HIGH)
      expect(data[1].priority).toBe(JobPriority.NORMAL)
      expect(data[2].priority).toBe(JobPriority.LOW)
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failures
      // For now, we'll test that the queue manager handles errors properly
      const { data, error } = await testQueueManager.getJobById('invalid-id')

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })

    it('should handle invalid job data', async () => {
      // Try to create job with invalid data
      const { data, error } = await testQueueManager.createJob({
        user_id: '',
        job_type: JobType.CAROUSEL_GENERATION,
        priority: JobPriority.NORMAL,
        payload: {}
      })

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle concurrent job creation', async () => {
      // Create multiple jobs concurrently
      const promises = Array.from({ length: 5 }, () => 
        DatabaseTestHelpers.createTestJob()
      )

      const jobs = await Promise.all(promises)

      // Verify all jobs were created
      expect(jobs).toHaveLength(5)
      jobs.forEach(job => {
        expect(job).toBeDefined()
        expect(job.id).toBeDefined()
        expect(job.user_id).toBe(TEST_USER_ID)
      })
    })

    it('should handle concurrent status updates', async () => {
      // Create a job
      const job = await DatabaseTestHelpers.createTestJob()

      // Update status concurrently
      const promises = [
        DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.PROCESSING, 25),
        DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.PROCESSING, 50),
        DatabaseTestHelpers.updateJobStatus(job.id, JobStatus.PROCESSING, 75)
      ]

      const results = await Promise.all(promises)

      // Verify all updates were successful
      results.forEach(result => {
        expect(result).toBeDefined()
        expect(result.status).toBe(JobStatus.PROCESSING)
      })
    })
  })
}) 