// =============================================================================
// Job Processor - Background Job Processing Engine
// =============================================================================
// Bu dosya job queue'dan job'ları alıp işleyen background processor'ı içerir
// =============================================================================

import { QueueManager } from './index'
import { createClient } from '@/utils/supabase/server'
import type { 
  GenerationJob, 
  JobStatus, 
  CarouselGenerationResult,
  ProgressUpdate,
  JobError,
  QueueError
} from '@/types/queue-system'
import type { Carousel, CarouselSlide } from '@/lib/carousel'

export class JobProcessor {
  private queueManager: QueueManager;
  private supabase;
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.queueManager = new QueueManager();
    this.supabase = createClient();
  }

  private async getSupabase() {
    return await this.supabase;
  }

  // =============================================================================
  // Core Processing Methods
  // =============================================================================

  /**
   * Process the next available job
   */
  async processNextJob(): Promise<boolean> {
    if (this.isProcessing) {
      return false; // Already processing
    }

    try {
      const job = await this.queueManager.getNextJob();
      if (!job) {
        return false; // No jobs available
      }

      this.isProcessing = true;
      
      try {
        await this.processJob(job);
        return true; // Successfully processed
      } catch (error) {
        console.error(`Job processing failed for job ${job.id}:`, error);
        await this.handleJobError(job, error as Error);
        return false; // Processing failed
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a specific job
   */
  async processJob(job: GenerationJob): Promise<void> {
    console.log(`Starting to process job ${job.id} for carousel ${job.carousel_id}`);

    // Update job status to processing
    await this.queueManager.updateJobStatus(job.id, 'processing');
    
    // Update carousel progress
    await this.updateCarouselProgress(job.carousel_id, 0, 'Starting generation...');

    try {
      // Process based on job type
      switch (job.job_type) {
        case 'carousel_generation':
          await this.processCarouselGeneration(job);
          break;
        case 'image_generation':
          await this.processImageGeneration(job);
          break;
        case 'content_strategy':
          await this.processContentStrategy(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.job_type}`);
      }

      // Mark job as completed
      await this.queueManager.updateJobStatus(job.id, 'completed');
      await this.updateCarouselProgress(job.carousel_id, 100, 'Generation completed!');

    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }

  // =============================================================================
  // Job Type Processors
  // =============================================================================

  /**
   * Process carousel generation job
   */
  private async processCarouselGeneration(job: GenerationJob): Promise<void> {
    const { payload } = job;
    const { imageCount, prompt, styles, aspectRatio } = payload;

    console.log(`Processing carousel generation: ${imageCount} images for prompt: ${prompt}`);

    // Initialize AI services
    const aiOrchestrator = await this.initializeAIServices();

    try {
      // Step 1: Content Strategy (20%)
      await this.updateCarouselProgress(job.carousel_id, 10, 'Creating content strategy...');
      
      const contentStrategy = await aiOrchestrator.generateContentStrategy({
        topic: prompt,
        audience: payload.audience || 'general',
        purpose: payload.purpose || 'educate',
        keyPoints: payload.keyPoints || [prompt],
        slideCount: imageCount,
        style: styles?.includes('creative') ? 'creative' : 'professional'
      });

      await this.updateCarouselProgress(job.carousel_id, 20, 'Content strategy created');

      // Step 2: Generate images for each slide (60%)
      const slides: CarouselGenerationResult['slides'] = [];
      
      for (let i = 1; i <= imageCount; i++) {
        const progress = 20 + (i / imageCount) * 60;
        await this.updateCarouselProgress(
          job.carousel_id, 
          Math.round(progress), 
          `Generating slide ${i}/${imageCount}...`
        );

        const slide = await this.generateSlideWithAI(
          i, 
          contentStrategy.data.slides[i - 1], 
          payload, 
          aiOrchestrator
        );
        slides.push(slide);
      }

      // Step 3: Final processing (20%)
      await this.updateCarouselProgress(job.carousel_id, 90, 'Finalizing carousel...');

      const finalCaption = await this.generateFinalCaptionWithAI(
        prompt, 
        contentStrategy.data.finalCaption,
        aiOrchestrator
      );
      
      // Step 4: Save results to database
      await this.saveCarouselResults(job.carousel_id, slides, finalCaption);

      // Step 5: Update job with results
      const result: CarouselGenerationResult = {
        slides,
        finalCaption,
        metadata: {
          processingTime: Date.now() - new Date(job.started_at!).getTime(),
          aiModel: contentStrategy.metadata.model,
          totalCost: contentStrategy.metadata.cost
        }
      };

      await this.queueManager.updateJobStatus(job.id, 'completed', { result });

    } catch (error) {
      console.error('AI generation failed:', error);
      throw error;
    }
  }

  /**
   * Process image generation job (placeholder for future)
   */
  private async processImageGeneration(job: GenerationJob): Promise<void> {
    // TODO: Implement image generation processing
    throw new Error('Image generation processing not yet implemented');
  }

  /**
   * Process content strategy job (placeholder for future)
   */
  private async processContentStrategy(job: GenerationJob): Promise<void> {
    // TODO: Implement content strategy processing
    throw new Error('Content strategy processing not yet implemented');
  }

  // =============================================================================
  // AI Generation Methods (Real AI Services)
  // =============================================================================

  /**
   * Initialize AI services
   */
  private async initializeAIServices() {
    const { AIServiceOrchestrator } = await import('@/lib/ai-services');
    
    const orchestrator = new AIServiceOrchestrator({
      timeout: 60000, // 60 seconds
      retries: 3,
      costLimit: 2.0, // $2.00 limit per job
      qualityThreshold: 0.7
    });

    // Register OpenAI service
    if (process.env.OPENAI_API_KEY) {
      orchestrator.registerService('openai', {
        provider: 'openai',
        config: {
          apiKey: process.env.OPENAI_API_KEY,
          maxRetries: 3,
          timeout: 30000
        },
        enabled: true,
        priority: 1
      });
    }

    // Register Google Gemini service
    if (process.env.GOOGLE_AI_API_KEY) {
      orchestrator.registerService('google', {
        provider: 'google',
        config: {
          apiKey: process.env.GOOGLE_AI_API_KEY,
          maxRetries: 3,
          timeout: 30000
        },
        enabled: true,
        priority: 2
      });
    }

    // Register mock service as fallback
    orchestrator.registerService('mock', {
      provider: 'mock',
      config: {
        apiKey: 'mock-key',
        maxRetries: 1,
        timeout: 5000
      },
      enabled: true,
      priority: 3
    });

    return orchestrator;
  }

  /**
   * Generate slide with AI
   */
  private async generateSlideWithAI(
    slideNumber: number,
    contentStrategy: any,
    payload: any,
    aiOrchestrator: any
  ) {
    try {
      // Generate image using AI
      const imageResult = await aiOrchestrator.generateImage({
        prompt: contentStrategy.imagePrompt || `${payload.prompt} - slide ${slideNumber}`,
        style: payload.styles?.includes('creative') ? 'creative' : 'professional',
        aspectRatio: payload.aspectRatio || '1:1',
        quality: 'standard',
        numberOfImages: 1
      });

      return {
        slideNumber,
        imageUrl: imageResult.data.url,
        caption: contentStrategy.caption,
        imagePrompt: contentStrategy.imagePrompt
      };
    } catch (error) {
      console.error(`Image generation failed for slide ${slideNumber}:`, error);
      
      // Fallback to mock image
      return {
        slideNumber,
        imageUrl: `https://picsum.photos/400/400?random=${Date.now()}-${slideNumber}`,
        caption: contentStrategy.caption,
        imagePrompt: contentStrategy.imagePrompt
      };
    }
  }

  /**
   * Generate final caption with AI
   */
  private async generateFinalCaptionWithAI(
    prompt: string,
    baseCaption: string,
    aiOrchestrator: any
  ): Promise<string> {
    try {
      const captionResult = await aiOrchestrator.generateText({
        prompt: `Create a final caption for a carousel about "${prompt}". Base content: "${baseCaption}". Make it engaging and include relevant hashtags.`,
        maxTokens: 200,
        temperature: 0.7,
        style: 'creative'
      });

      return captionResult.data.text;
    } catch (error) {
      console.error('Caption generation failed:', error);
      
      // Fallback to basic caption
      return `${baseCaption}\n\n#${prompt.replace(/\s+/g, '')} #socialmedia #contentcreation #digitalmarketing`;
    }
  }

  // =============================================================================
  // Database Operations
  // =============================================================================

  /**
   * Save carousel results to database
   */
  private async saveCarouselResults(
    carouselId: string, 
    slides: CarouselGenerationResult['slides'], 
    finalCaption: string
  ): Promise<void> {
    try {
      // Update carousel status and final caption
      const supabase = await this.getSupabase();
      await supabase
        .from('carousels')
        .update({
          status: 'completed',
          final_caption: finalCaption,
          progress_percent: 100,
          progress_message: 'Carousel ready!',
          updated_at: new Date().toISOString()
        })
        .eq('id', carouselId);

      // Create carousel slides
      for (const slide of slides) {
        await supabase
          .from('carousel_slides')
          .insert({
            carousel_id: carouselId,
            slide_number: slide.slideNumber,
            image_url: slide.imageUrl,
            caption: slide.caption
          });
      }

    } catch (error) {
      console.error('Error saving carousel results:', error);
      throw new Error(`Failed to save carousel results: ${error}`);
    }
  }

  // =============================================================================
  // Progress Tracking
  // =============================================================================

  /**
   * Update carousel progress
   */
  private async updateCarouselProgress(
    carouselId: string, 
    percent: number, 
    message: string
  ): Promise<void> {
    try {
      const supabase = await this.getSupabase();
      await supabase
        .from('carousels')
        .update({
          progress_percent: percent,
          progress_message: message,
          updated_at: new Date().toISOString()
        })
        .eq('id', carouselId);
    } catch (error) {
      console.error('Error updating carousel progress:', error);
      // Don't throw - progress updates shouldn't fail the job
    }
  }

  // =============================================================================
  // Error Handling
  // =============================================================================

  /**
   * Handle job processing errors
   */
  private async handleJobError(job: GenerationJob, error: Error): Promise<void> {
    console.error(`Job ${job.id} failed:`, error);

    // Check if job can be retried
    if (this.queueManager.canRetryJob(job)) {
      console.log(`Requeuing job ${job.id} for retry`);
      await this.queueManager.requeueJob(job.id);
    } else {
      // Mark job as failed
      await this.queueManager.updateJobStatus(job.id, 'failed', {
        error_message: error.message
      });

      // Update carousel status
      const supabase = await this.getSupabase();
      await supabase
        .from('carousels')
        .update({
          status: 'failed',
          error_message: error.message,
          progress_percent: 0,
          progress_message: 'Generation failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', job.carousel_id);
    }
  }

  // =============================================================================
  // Background Processing Control
  // =============================================================================

  /**
   * Start continuous background processing
   */
  async startProcessing(intervalMs: number = 5000): Promise<void> {
    if (this.processingInterval) {
      console.log('Job processor already running');
      return;
    }

    console.log('Starting job processor...');
    
    this.processingInterval = setInterval(async () => {
      try {
        await this.processNextJob();
      } catch (error) {
        console.error('Error in background processing:', error);
      }
    }, intervalMs);
  }

  /**
   * Stop background processing
   */
  async stopProcessing(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log('Job processor stopped');
    }
  }

  /**
   * Process multiple jobs in a batch
   */
  async processBatch(maxJobs: number = 5): Promise<number> {
    let processed = 0;
    
    for (let i = 0; i < maxJobs; i++) {
      const hasJob = await this.processNextJob();
      if (hasJob) {
        processed++;
      } else {
        break; // No more jobs
      }
    }

    return processed;
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Delay utility for simulating processing time
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get processing status
   */
  isRunning(): boolean {
    return this.processingInterval !== null;
  }

  /**
   * Get current processing state
   */
  getProcessingState(): {
    isProcessing: boolean;
    isRunning: boolean;
  } {
    return {
      isProcessing: this.isProcessing,
      isRunning: this.isRunning()
    };
  }
} 