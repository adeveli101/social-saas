// =============================================================================
// Queue Manager - Job Queue Operations
// =============================================================================
// Bu dosya job queue sistemi için tüm CRUD işlemlerini yönetir
// =============================================================================

import { createClient } from '@/utils/supabase/server'
import type { 
  GenerationJob, 
  JobStatus, 
  CarouselGenerationPayload,
  JobCreationData,
  JobUpdateData,
  JobFilter,
  JobError,
  QueueError
} from '@/types/queue-system'

export class QueueManager {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  // =============================================================================
  // Core CRUD Operations
  // =============================================================================

  /**
   * Create a new job in the queue
   */
  async createJob(data: JobCreationData): Promise<string> {
    try {
      const { data: job, error } = await this.supabase
        .from('generation_jobs')
        .insert({
          carousel_id: data.carouselId,
          user_id: data.userId,
          payload: data.payload,
          priority: data.priority || 1,
          status: 'queued'
        })
        .select('id')
        .single();

      if (error) {
        throw new QueueError(`Failed to create job: ${error.message}`, 'JOB_CREATION_FAILED');
      }

      return job.id;
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error creating job: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  /**
   * Get a specific job by ID
   */
  async getJob(jobId: string): Promise<GenerationJob | null> {
    try {
      const { data, error } = await this.supabase
        .from('generation_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new QueueError(`Failed to get job: ${error.message}`, 'JOB_FETCH_FAILED');
      }

      return this.mapDatabaseJobToGenerationJob(data);
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error getting job: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  /**
   * Update job status and other fields
   */
  async updateJobStatus(
    jobId: string, 
    status: JobStatus, 
    updates?: JobUpdateData
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
        ...updates
      };

      // Set timestamps based on status
      if (status === 'processing') {
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed' || status === 'failed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('generation_jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) {
        throw new QueueError(`Failed to update job status: ${error.message}`, 'JOB_UPDATE_FAILED');
      }
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error updating job: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  /**
   * Get the next job to process (highest priority, oldest scheduled)
   */
  async getNextJob(): Promise<GenerationJob | null> {
    try {
      const { data, error } = await this.supabase
        .from('generation_jobs')
        .select('*')
        .eq('status', 'queued')
        .order('priority', { ascending: false })
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No jobs available
        }
        throw new QueueError(`Failed to get next job: ${error.message}`, 'NEXT_JOB_FETCH_FAILED');
      }

      return this.mapDatabaseJobToGenerationJob(data);
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error getting next job: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  /**
   * Requeue a failed job with exponential backoff
   */
  async requeueJob(jobId: string, delay?: number): Promise<void> {
    try {
      const job = await this.getJob(jobId);
      if (!job) {
        throw new QueueError(`Job ${jobId} not found`, 'JOB_NOT_FOUND');
      }

      if (job.retry_count >= job.max_retries) {
        throw new QueueError(`Job ${jobId} has exceeded max retries`, 'MAX_RETRIES_EXCEEDED');
      }

      const backoffDelay = delay || Math.pow(2, job.retry_count) * 1000; // 1s, 2s, 4s, 8s...
      const scheduledAt = new Date(Date.now() + backoffDelay).toISOString();

      await this.updateJobStatus(jobId, 'queued', {
        scheduled_at: scheduledAt,
        retry_count: job.retry_count + 1,
        error_message: null // Clear previous error
      });
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error requeuing job: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  // =============================================================================
  // Query Operations
  // =============================================================================

  /**
   * Get jobs for a specific user
   */
  async getUserJobs(userId: string, filter?: JobFilter): Promise<GenerationJob[]> {
    try {
      let query = this.supabase
        .from('generation_jobs')
        .select('*')
        .eq('user_id', userId);

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }

      if (filter?.jobType) {
        query = query.eq('job_type', filter.jobType);
      }

      query = query.order('created_at', { ascending: false });

      if (filter?.limit) {
        query = query.limit(filter.limit);
      }

      if (filter?.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new QueueError(`Failed to get user jobs: ${error.message}`, 'USER_JOBS_FETCH_FAILED');
      }

      return (data || []).map(job => this.mapDatabaseJobToGenerationJob(job));
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error getting user jobs: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  /**
   * Get jobs by status
   */
  async getJobsByStatus(status: JobStatus, limit: number = 10): Promise<GenerationJob[]> {
    try {
      const { data, error } = await this.supabase
        .from('generation_jobs')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        throw new QueueError(`Failed to get jobs by status: ${error.message}`, 'JOBS_BY_STATUS_FETCH_FAILED');
      }

      return (data || []).map(job => this.mapDatabaseJobToGenerationJob(job));
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error getting jobs by status: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    queued: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('generation_jobs')
        .select('status');

      if (error) {
        throw new QueueError(`Failed to get queue stats: ${error.message}`, 'QUEUE_STATS_FETCH_FAILED');
      }

      const stats = {
        queued: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        total: 0
      };

      (data || []).forEach(job => {
        stats[job.status as keyof typeof stats]++;
        stats.total++;
      });

      return stats;
    } catch (error) {
      if (error instanceof QueueError) {
        throw error;
      }
      throw new QueueError(`Unexpected error getting queue stats: ${error}`, 'UNEXPECTED_ERROR');
    }
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Map database job to GenerationJob interface
   */
  private mapDatabaseJobToGenerationJob(dbJob: any): GenerationJob {
    return {
      id: dbJob.id,
      carousel_id: dbJob.carousel_id,
      user_id: dbJob.user_id,
      job_type: dbJob.job_type as any,
      status: dbJob.status as JobStatus,
      priority: dbJob.priority,
      payload: dbJob.payload,
      result: dbJob.result,
      error_message: dbJob.error_message,
      retry_count: dbJob.retry_count,
      max_retries: dbJob.max_retries,
      scheduled_at: dbJob.scheduled_at,
      started_at: dbJob.started_at,
      completed_at: dbJob.completed_at,
      created_at: dbJob.created_at,
      updated_at: dbJob.updated_at
    };
  }

  /**
   * Check if a job can be retried
   */
  canRetryJob(job: GenerationJob): boolean {
    return job.status === 'failed' && job.retry_count < job.max_retries;
  }

  /**
   * Calculate estimated completion time for a job
   */
  calculateEstimatedCompletion(job: GenerationJob): Date | null {
    if (job.status === 'completed' || job.status === 'failed') {
      return null;
    }

    const baseTime = 60; // 60 seconds base time
    const retryMultiplier = 1 + (job.retry_count * 0.5); // 50% increase per retry
    const estimatedSeconds = baseTime * retryMultiplier;

    const startTime = job.started_at ? new Date(job.started_at) : new Date();
    return new Date(startTime.getTime() + estimatedSeconds * 1000);
  }
} 