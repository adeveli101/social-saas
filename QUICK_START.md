# 🚀 AI Generation System - Quick Start Guide

## 📋 Overview
This guide will get you started with implementing the AI Generation System in the existing Social SaaS project. Follow these steps to begin Phase 1 immediately.

## ⚡ Prerequisites
- ✅ Supabase project access
- ✅ Local development environment set up
- ✅ Clerk authentication working
- ✅ Basic Next.js project running

## 🎯 Phase 1 Quick Start (2-3 hours)

### Step 1: Database Setup (30 minutes)

#### 1.1 Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query

#### 1.2 Run Database Migration
Copy and paste this complete SQL script:

```sql
-- =============================================================================
-- AI Generation System Database Setup
-- =============================================================================

-- 1. Create generation_jobs table
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_id UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'carousel_generation',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
  payload JSONB NOT NULL,
  result JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_scheduled_at ON generation_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_carousel_id ON generation_jobs(carousel_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status_priority ON generation_jobs(status, priority DESC);

-- 3. Enable Row Level Security
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view their own generation jobs" ON generation_jobs
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage all jobs" ON generation_jobs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 5. Enhance carousels table
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100);
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_message TEXT;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS generation_metadata JSONB;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMP WITH TIME ZONE;

-- 6. Enhance users table for credits
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_limit INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;

-- 7. Create indexes on new columns
CREATE INDEX IF NOT EXISTS idx_carousels_progress ON carousels(progress_percent);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);

-- =============================================================================
-- Verification Queries (Optional - Run to verify setup)
-- =============================================================================

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('generation_jobs', 'carousels', 'users');

-- Check if indexes exist
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('generation_jobs', 'carousels', 'users') 
ORDER BY tablename, indexname;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('generation_jobs', 'carousels', 'users');
```

#### 1.3 Verify Database Setup
Run the verification queries at the end of the script to ensure everything is set up correctly.

---

### Step 2: TypeScript Types (15 minutes)

#### 2.1 Create Queue System Types
Create `src/types/queue-system.ts`:

```typescript
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type JobType = 'carousel_generation' | 'image_generation' | 'content_strategy';

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

export interface CarouselGenerationPayload {
  prompt: string;
  imageCount: number;
  styles: string[];
  aspectRatio: '1:1' | '4:5' | '9:16';
  audience?: string;
  purpose?: string;
  keyPoints?: string[];
}

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
```

#### 2.2 Create AI Services Types
Create `src/types/ai-generation.ts`:

```typescript
export interface AIServiceConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries: number;
  timeout: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
  quality?: 'standard' | 'hd';
  size?: string;
}

export interface ImageGenerationResponse {
  url: string;
  revisedPrompt?: string;
  metadata: {
    model: string;
    processingTime: number;
    cost: number;
  };
}

export interface ContentStrategyRequest {
  topic: string;
  audience: string;
  purpose: string;
  keyPoints: string[];
  slideCount: number;
}

export interface ContentStrategyResponse {
  slides: {
    slideNumber: number;
    title: string;
    caption: string;
    imagePrompt: string;
  }[];
  finalCaption: string;
  visualTheme: string;
}
```

#### 2.3 Update Database Types
Run this command to regenerate Supabase types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

---

### Step 3: Queue Manager (45 minutes)

#### 3.1 Create Queue Operations
Create `src/lib/queue/index.ts`:

```typescript
import { createClient } from '@/utils/supabase/server';
import type { GenerationJob, JobStatus, CarouselGenerationPayload } from '@/types/queue-system';

export class QueueManager {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async createJob(data: {
    carouselId: string;
    userId: string;
    payload: CarouselGenerationPayload;
    priority?: number;
  }): Promise<string> {
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
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return job.id;
  }

  async getJob(jobId: string): Promise<GenerationJob | null> {
    const { data, error } = await this.supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get job: ${error.message}`);
    }

    return data as GenerationJob;
  }

  async updateJobStatus(
    jobId: string, 
    status: JobStatus, 
    updates?: Partial<GenerationJob>
  ): Promise<void> {
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'processing' && { started_at: new Date().toISOString() }),
      ...(status === 'completed' && { completed_at: new Date().toISOString() }),
      ...updates
    };

    const { error } = await this.supabase
      .from('generation_jobs')
      .update(updateData)
      .eq('id', jobId);

    if (error) {
      throw new Error(`Failed to update job status: ${error.message}`);
    }
  }

  async getNextJob(): Promise<GenerationJob | null> {
    const { data, error } = await this.supabase
      .from('generation_jobs')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No jobs
      throw new Error(`Failed to get next job: ${error.message}`);
    }

    return data as GenerationJob;
  }

  async requeueJob(jobId: string, delay?: number): Promise<void> {
    const scheduledAt = delay 
      ? new Date(Date.now() + delay).toISOString()
      : new Date().toISOString();

    await this.updateJobStatus(jobId, 'queued', {
      scheduled_at: scheduledAt,
      retry_count: 0 // Reset retry count when manually requeuing
    });
  }

  async getUserJobs(userId: string, limit = 10): Promise<GenerationJob[]> {
    const { data, error } = await this.supabase
      .from('generation_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get user jobs: ${error.message}`);
    }

    return data as GenerationJob[];
  }
}
```

#### 3.2 Create Job Processor Foundation
Create `src/lib/queue/job-processor.ts`:

```typescript
import { QueueManager } from './index';
import type { GenerationJob } from '@/types/queue-system';

export class JobProcessor {
  private queueManager: QueueManager;
  private isProcessing: boolean = false;

  constructor() {
    this.queueManager = new QueueManager();
  }

  async processNextJob(): Promise<boolean> {
    if (this.isProcessing) return false;

    const job = await this.queueManager.getNextJob();
    if (!job) return false;

    this.isProcessing = true;
    try {
      await this.processJob(job);
      return true;
    } catch (error) {
      console.error('Job processing failed:', error);
      await this.handleJobError(job, error as Error);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  async processJob(job: GenerationJob): Promise<void> {
    // Mark job as processing
    await this.queueManager.updateJobStatus(job.id, 'processing');
    
    // Update carousel progress
    await this.updateCarouselProgress(job.carousel_id, 0, 'Starting generation...');

    // TODO: Phase 2 - Implement actual AI generation
    // For now, simulate processing
    await this.simulateProcessing(job);
  }

  private async simulateProcessing(job: GenerationJob): Promise<void> {
    const { imageCount } = job.payload;
    
    // Simulate content strategy generation
    await this.updateCarouselProgress(job.carousel_id, 20, 'Creating content strategy...');
    await this.delay(2000);

    // Simulate image generation for each slide
    for (let i = 1; i <= imageCount; i++) {
      const progress = 20 + (i / imageCount) * 60;
      await this.updateCarouselProgress(
        job.carousel_id, 
        Math.round(progress), 
        `Generating slide ${i}/${imageCount}...`
      );
      await this.delay(1000);
    }

    // Simulate final processing
    await this.updateCarouselProgress(job.carousel_id, 90, 'Finalizing carousel...');
    await this.delay(1000);

    // Complete the job
    await this.completeJob(job);
  }

  private async completeJob(job: GenerationJob): Promise<void> {
    // TODO: Phase 2 - Save actual generated content
    const mockResult = {
      slides: Array.from({ length: job.payload.imageCount }, (_, i) => ({
        slideNumber: i + 1,
        imageUrl: `https://picsum.photos/400/400?random=${job.id}-${i}`,
        caption: `Generated caption for slide ${i + 1}: ${job.payload.prompt}`,
        imagePrompt: `${job.payload.prompt} - slide ${i + 1}`
      })),
      finalCaption: `🎯 ${job.payload.prompt}\n\n✨ Generated ${job.payload.imageCount} slides with AI!`,
      metadata: {
        processingTime: 30,
        aiModel: 'mock-v1',
        totalCost: 0.05
      }
    };

    // Update job as completed
    await this.queueManager.updateJobStatus(job.id, 'completed', {
      result: mockResult
    });

    // Update carousel as completed
    await this.updateCarouselProgress(job.carousel_id, 100, 'Carousel ready!');
    await this.updateCarouselStatus(job.carousel_id, 'completed', mockResult.finalCaption);
  }

  private async handleJobError(job: GenerationJob, error: Error): Promise<void> {
    const shouldRetry = job.retry_count < job.max_retries;
    
    if (shouldRetry) {
      // Implement exponential backoff
      const delay = Math.pow(2, job.retry_count) * 1000; // 1s, 2s, 4s, 8s...
      
      await this.queueManager.updateJobStatus(job.id, 'queued', {
        retry_count: job.retry_count + 1,
        scheduled_at: new Date(Date.now() + delay).toISOString(),
        error_message: error.message
      });
    } else {
      // Mark as failed
      await this.queueManager.updateJobStatus(job.id, 'failed', {
        error_message: error.message
      });
      
      await this.updateCarouselStatus(job.carousel_id, 'failed', null, error.message);
    }
  }

  private async updateCarouselProgress(
    carouselId: string, 
    percent: number, 
    message: string
  ): Promise<void> {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = createClient();
    
    await supabase
      .from('carousels')
      .update({
        progress_percent: percent,
        progress_message: message,
        updated_at: new Date().toISOString()
      })
      .eq('id', carouselId);
  }

  private async updateCarouselStatus(
    carouselId: string,
    status: string,
    finalCaption?: string,
    errorMessage?: string
  ): Promise<void> {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = createClient();
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (finalCaption) updateData.final_caption = finalCaption;
    if (errorMessage) updateData.error_message = errorMessage;
    
    await supabase
      .from('carousels')
      .update(updateData)
      .eq('id', carouselId);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async startProcessing(): Promise<void> {
    // TODO: Implement continuous processing loop
    console.log('Job processor started (manual trigger for Phase 1)');
  }

  async stopProcessing(): Promise<void> {
    this.isProcessing = false;
    console.log('Job processor stopped');
  }
}
```

---

### Step 4: Enhanced API Routes (30 minutes)

#### 4.1 Update Carousel Generation API
Update `src/app/api/carousel/generate/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { QueueManager } from '@/lib/queue'

const generateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  imageCount: z.number().min(2).max(10),
  styles: z.array(z.string()).optional(),
  aspectRatio: z.enum(['1:1', '4:5', '9:16']).optional()
})

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = generateSchema.parse(body)
    
    const supabase = await createClient()
    
    // 1. Check user credits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user || user.credits <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INSUFFICIENT_CREDITS', 
          message: 'You need more credits to generate content',
          code: 402 
        },
        { status: 402 }
      )
    }

    // 2. Create carousel record
    const { data: carousel, error: carouselError } = await supabase
      .from('carousels')
      .insert({
        user_id: userId,
        prompt: validatedData.prompt,
        image_count: validatedData.imageCount,
        status: 'pending',
        progress_percent: 0,
        progress_message: 'Queued for processing...'
      })
      .select('id')
      .single()

    if (carouselError) {
      throw new Error(`Failed to create carousel: ${carouselError.message}`)
    }

    // 3. Create job in queue
    const queueManager = new QueueManager()
    const jobId = await queueManager.createJob({
      carouselId: carousel.id,
      userId: userId,
      payload: {
        prompt: validatedData.prompt,
        imageCount: validatedData.imageCount,
        styles: validatedData.styles || ['photo'],
        aspectRatio: validatedData.aspectRatio || '1:1'
      }
    })

    // 4. Deduct credit
    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('clerk_id', userId)

    return NextResponse.json({
      success: true,
      data: {
        carouselId: carousel.id,
        jobId: jobId,
        estimatedTime: 60,
        remainingCredits: user.credits - 1
      },
      message: 'Generation started successfully'
    })

  } catch (error) {
    console.error('Generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to start generation'
      },
      { status: 500 }
    )
  }
}
```

#### 4.2 Create Job Status API
Create `src/app/api/queue/status/[id]/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { QueueManager } from '@/lib/queue'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const queueManager = new QueueManager()
    const job = await queueManager.getJob(params.id)

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'JOB_NOT_FOUND' },
        { status: 404 }
      )
    }

    if (job.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        progress: {
          percent: 0, // TODO: Get from carousel table
          message: 'Processing...'
        },
        createdAt: job.created_at,
        estimatedCompletion: job.estimated_completion_time,
        result: job.result
      }
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
```

#### 4.3 Create Job Processor API
Create `src/app/api/queue/process/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { JobProcessor } from '@/lib/queue/job-processor'

export async function POST(request: Request) {
  // Verify API key for security
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.QUEUE_PROCESSOR_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' },
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
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Job processing error:', error)
    return NextResponse.json(
      { success: false, error: 'PROCESSING_ERROR' },
      { status: 500 }
    )
  }
}
```

---

### Step 5: Testing & Verification (20 minutes)

#### 5.1 Test Database Setup
Run this in your browser console on the Supabase dashboard:
```sql
-- Test job creation
INSERT INTO generation_jobs (carousel_id, user_id, payload) 
VALUES (
  (SELECT id FROM carousels LIMIT 1),
  'test-user-id',
  '{"prompt": "test", "imageCount": 3, "styles": ["photo"], "aspectRatio": "1:1"}'::jsonb
);

-- Check if job was created
SELECT * FROM generation_jobs ORDER BY created_at DESC LIMIT 1;
```

#### 5.2 Test API Endpoints
Create a simple test file `test-api.http` (if you have REST Client extension):

```http
### Test Carousel Generation
POST http://localhost:3000/api/carousel/generate
Content-Type: application/json

{
  "prompt": "Digital marketing tips for small businesses",
  "imageCount": 5,
  "styles": ["photo"],
  "aspectRatio": "1:1"
}

### Test Job Processing (requires QUEUE_PROCESSOR_SECRET)
POST http://localhost:3000/api/queue/process
Authorization: Bearer your-secret-key
```

#### 5.3 Add Environment Variables
Add to your `.env.local`:
```bash
# Queue System
QUEUE_PROCESSOR_SECRET=your-random-secret-key-here

# For Phase 2 (AI Services)
OPENAI_API_KEY=your-openai-key
GOOGLE_AI_API_KEY=your-gemini-key
```

---

## ✅ Phase 1 Completion Checklist

After completing all steps above, verify:

- [ ] **Database Setup**: generation_jobs table exists with proper indexes and RLS
- [ ] **Enhanced Tables**: carousels and users tables have new progress/credit columns
- [ ] **TypeScript Types**: All interfaces defined without TypeScript errors
- [ ] **Queue Manager**: Can create, read, and update jobs
- [ ] **Job Processor**: Can process jobs and update progress (mock generation)
- [ ] **API Routes**: Enhanced carousel generation API working
- [ ] **Job Status API**: Can check job status
- [ ] **Processor API**: Can trigger job processing manually

## 🎯 What's Next?

Once Phase 1 is complete:

1. **Phase 2**: Integrate real AI services (OpenAI DALL-E, Google Gemini)
2. **Phase 3**: Implement automatic background processing
3. **Phase 4**: Add real-time frontend updates
4. **Phase 5**: Deploy to AWS Amplify

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error**: Check Supabase URL and keys in `.env.local`
2. **RLS Policy Error**: Ensure your user has proper authentication
3. **TypeScript Errors**: Run `npm run build` to check for type issues
4. **Job Not Processing**: Check if QUEUE_PROCESSOR_SECRET is set correctly

### Getting Help:

1. Check the logs in Supabase dashboard
2. Use browser dev tools to inspect API responses
3. Review the WORKFLOW.md and TODO.md for detailed steps
4. Check .cursor/rules/ai-generation-system.md for best practices

---

**🚀 Ready to start? Begin with Step 1 and work through each section systematically. Update the TODO.md file as you complete each task!** 