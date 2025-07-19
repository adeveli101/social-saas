// =============================================================================
// Queue System Type Definitions
// =============================================================================
// Bu dosya job queue sistemi için tüm TypeScript type'larını içerir
// =============================================================================

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type JobType = 'carousel_generation' | 'image_generation' | 'content_strategy';

// =============================================================================
// Core Job Interface
// =============================================================================
export interface GenerationJob {
  id: string;
  carousel_id: string;
  user_id: string;
  job_type: JobType;
  status: JobStatus;
  priority: number;
  payload: CarouselGenerationPayload;
  result?: CarouselGenerationResult;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Payload Types
// =============================================================================
export interface CarouselGenerationPayload {
  prompt: string;
  imageCount: number;
  styles: string[];
  aspectRatio: '1:1' | '4:5' | '9:16';
  audience?: string;
  purpose?: string;
  keyPoints?: string[];
}

export interface ImageGenerationPayload {
  prompt: string;
  style: string;
  aspectRatio: string;
  quality?: 'standard' | 'hd';
  size?: string;
}

export interface ContentStrategyPayload {
  topic: string;
  audience: string;
  purpose: string;
  keyPoints: string[];
  slideCount: number;
}

// =============================================================================
// Result Types
// =============================================================================
export interface CarouselGenerationResult {
  slides: GeneratedSlide[];
  finalCaption: string;
  metadata: {
    processingTime: number;
    aiModel: string;
    totalCost: number;
  };
}

export interface GeneratedSlide {
  slideNumber: number;
  imageUrl: string;
  caption: string;
  imagePrompt: string;
}

export interface ImageGenerationResult {
  url: string;
  revisedPrompt?: string;
  metadata: {
    model: string;
    processingTime: number;
    cost: number;
  };
}

export interface ContentStrategyResult {
  slides: {
    slideNumber: number;
    title: string;
    caption: string;
    imagePrompt: string;
  }[];
  finalCaption: string;
  visualTheme: string;
}

// =============================================================================
// Queue Management Types
// =============================================================================
export interface JobCreationData {
  carouselId: string;
  userId: string;
  payload: CarouselGenerationPayload;
  priority?: number;
}

export interface JobUpdateData {
  status?: JobStatus;
  result?: CarouselGenerationResult;
  error_message?: string;
  retry_count?: number;
  started_at?: string;
  completed_at?: string;
}

export interface JobFilter {
  userId?: string;
  status?: JobStatus;
  jobType?: JobType;
  limit?: number;
  offset?: number;
}

// =============================================================================
// Progress Tracking Types
// =============================================================================
export interface ProgressUpdate {
  jobId: string;
  carouselId: string;
  percent: number;
  message: string;
  estimatedCompletion?: string;
}

export interface CarouselProgress {
  carouselId: string;
  progressPercent: number;
  progressMessage: string;
  estimatedCompletionTime?: string;
  generationMetadata?: Record<string, any>;
}

// =============================================================================
// Error Types
// =============================================================================
export class JobError extends Error {
  constructor(
    message: string,
    public jobId: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'JobError';
  }
}

export class QueueError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'QueueError';
  }
}

// =============================================================================
// Utility Types
// =============================================================================
export type JobCallback = (job: GenerationJob) => Promise<void>;
export type ProgressCallback = (update: ProgressUpdate) => Promise<void>;
export type ErrorCallback = (error: JobError) => Promise<void>;

// =============================================================================
// Database Types (for Supabase integration)
// =============================================================================
export interface DatabaseGenerationJob {
  id: string;
  carousel_id: string;
  user_id: string;
  job_type: string;
  status: string;
  priority: number;
  payload: any;
  result: any;
  error_message: string | null;
  retry_count: number;
  max_retries: number;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// API Response Types
// =============================================================================
export interface JobCreationResponse {
  success: boolean;
  data?: {
    jobId: string;
    carouselId: string;
    estimatedTime: number;
  };
  error?: string;
  message?: string;
}

export interface JobStatusResponse {
  success: boolean;
  data?: {
    id: string;
    status: JobStatus;
    progress: {
      percent: number;
      message: string;
    };
    createdAt: string;
    estimatedCompletion?: string;
    result?: CarouselGenerationResult;
  };
  error?: string;
}

export interface QueueProcessingResponse {
  success: boolean;
  data?: {
    processed: number;
    timestamp: string;
  };
  error?: string;
} 