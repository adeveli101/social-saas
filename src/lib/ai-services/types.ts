// =============================================================================
// AI Services Type Definitions
// =============================================================================
// Bu dosya AI servisleri için tüm TypeScript type'larını içerir
// =============================================================================

// =============================================================================
// Core AI Service Interfaces
// =============================================================================

export interface AIServiceConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries: number;
  timeout: number;
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    model: string;
    processingTime: number;
    cost: number;
    tokensUsed?: number;
  };
}

// =============================================================================
// Image Generation Types
// =============================================================================

export interface ImageGenerationRequest {
  prompt: string;
  style: string;
  aspectRatio: '1:1' | '4:5' | '9:16';
  quality?: 'standard' | 'hd';
  size?: string;
  numberOfImages?: number;
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

export interface ImageGenerationResult extends AIServiceResponse<ImageGenerationResponse> {
  data: ImageGenerationResponse;
}

// =============================================================================
// Content Strategy Types
// =============================================================================

export interface ContentStrategyRequest {
  topic: string;
  audience: string;
  purpose: string;
  keyPoints: string[];
  slideCount: number;
  style?: 'professional' | 'casual' | 'creative' | 'educational';
}

export interface ContentStrategySlide {
  slideNumber: number;
  title: string;
  caption: string;
  imagePrompt: string;
  keyMessage: string;
}

export interface ContentStrategyResponse {
  slides: ContentStrategySlide[];
  finalCaption: string;
  visualTheme: string;
  hashtags: string[];
  callToAction?: string;
}

export interface ContentStrategyResult extends AIServiceResponse<ContentStrategyResponse> {
  data: ContentStrategyResponse;
}

// =============================================================================
// Text Generation Types
// =============================================================================

export interface TextGenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  style?: 'professional' | 'casual' | 'creative' | 'technical';
}

export interface TextGenerationResponse {
  text: string;
  revisedPrompt?: string;
  metadata: {
    model: string;
    processingTime: number;
    cost: number;
    tokensUsed: number;
  };
}

export interface TextGenerationResult extends AIServiceResponse<TextGenerationResponse> {
  data: TextGenerationResponse;
}

// =============================================================================
// Error Types
// =============================================================================

export class AIServiceError extends Error {
  constructor(
    message: string,
    public service: string,
    public code: string,
    public retryable: boolean = false,
    public cost?: number
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class RateLimitError extends AIServiceError {
  constructor(service: string, retryAfter?: number) {
    super(
      `Rate limit exceeded for ${service}`,
      service,
      'RATE_LIMIT_EXCEEDED',
      true
    );
    this.retryAfter = retryAfter;
  }
  
  retryAfter?: number;
}

export class QuotaExceededError extends AIServiceError {
  constructor(service: string) {
    super(
      `Quota exceeded for ${service}`,
      service,
      'QUOTA_EXCEEDED',
      false
    );
  }
}

export class InvalidPromptError extends AIServiceError {
  constructor(service: string, details?: string) {
    super(
      `Invalid prompt for ${service}: ${details || 'Content policy violation'}`,
      service,
      'INVALID_PROMPT',
      false
    );
  }
}

// =============================================================================
// Service Provider Types
// =============================================================================

export type AIServiceProvider = 'openai' | 'google' | 'anthropic' | 'mock';

export interface AIServiceProviderConfig {
  provider: AIServiceProvider;
  config: AIServiceConfig;
  enabled: boolean;
  priority: number; // Lower number = higher priority
}

// =============================================================================
// Prompt Engineering Types
// =============================================================================

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: 'image' | 'content' | 'caption' | 'hashtag';
  provider: AIServiceProvider;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  description: string;
}

// =============================================================================
// Cost Tracking Types
// =============================================================================

export interface AIServiceCost {
  provider: AIServiceProvider;
  model: string;
  operation: 'image_generation' | 'text_generation' | 'content_strategy';
  cost: number;
  tokensUsed?: number;
  imagesGenerated?: number;
  timestamp: string;
}

export interface CostSummary {
  totalCost: number;
  costByProvider: Record<AIServiceProvider, number>;
  costByOperation: Record<string, number>;
  usageCount: number;
  period: 'daily' | 'weekly' | 'monthly';
}

// =============================================================================
// Quality Assessment Types
// =============================================================================

export interface QualityMetrics {
  relevance: number; // 0-1
  creativity: number; // 0-1
  technicalQuality: number; // 0-1
  userSatisfaction?: number; // 0-1
  feedback?: string;
}

export interface AIServiceQuality {
  service: AIServiceProvider;
  model: string;
  metrics: QualityMetrics;
  timestamp: string;
  jobId?: string;
}

// =============================================================================
// Utility Types
// =============================================================================

export type AIServiceCallback<T> = (result: AIServiceResponse<T>) => void;
export type ErrorCallback = (error: AIServiceError) => void;
export type ProgressCallback = (progress: number, message: string) => void;

export interface AIServiceOptions {
  timeout?: number;
  retries?: number;
  fallbackProvider?: AIServiceProvider;
  costLimit?: number;
  qualityThreshold?: number;
  onProgress?: ProgressCallback;
  onError?: ErrorCallback;
} 