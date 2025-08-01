// =============================================================================
// AI Services Orchestrator
// =============================================================================
// Bu dosya tüm AI servislerini yöneten ana orchestrator'ı içerir
// =============================================================================

import { OpenAIService } from './openai-service'
import { GeminiService } from './gemini-service'
import type { 
  AIServiceConfig, 
  AIServiceProvider,
  AIServiceProviderConfig,
  ImageGenerationRequest,
  ImageGenerationResult,
  TextGenerationRequest,
  TextGenerationResult,
  ContentStrategyRequest,
  ContentStrategyResult,
  AIServiceOptions
} from './types'
import { AIServiceError } from './types'

export class AIServiceOrchestrator {
  private services: Map<AIServiceProvider, any> = new Map()
  private configs: Map<AIServiceProvider, AIServiceProviderConfig> = new Map()
  private defaultOptions: AIServiceOptions

  constructor(defaultOptions: AIServiceOptions = {}) {
    this.defaultOptions = {
      timeout: 30000,
      retries: 3,
      costLimit: 1.0, // $1.00 limit
      qualityThreshold: 0.7,
      ...defaultOptions
    }
  }

  // =============================================================================
  // Service Registration
  // =============================================================================

  /**
   * Register an AI service provider
   */
  registerService(
    provider: AIServiceProvider, 
    config: AIServiceProviderConfig
  ): void {
    let service: any

    switch (provider) {
      case 'openai':
        service = new OpenAIService(config.config)
        break
      case 'google':
        service = new GeminiService(config.config)
        break
      case 'mock':
        // Mock service for testing
        service = this.createMockService()
        break
      default:
        throw new Error(`Unsupported AI service provider: ${provider}`)
    }

    this.services.set(provider, service)
    this.configs.set(provider, config)
  }

  /**
   * Get available service providers
   */
  getAvailableProviders(): AIServiceProvider[] {
    return Array.from(this.services.keys())
  }

  /**
   * Get service configuration
   */
  getServiceConfig(provider: AIServiceProvider): AIServiceProviderConfig | null {
    return this.configs.get(provider) || null
  }

  // =============================================================================
  // Image Generation
  // =============================================================================

  /**
   * Generate image with fallback strategy
   */
  async generateImage(
    request: ImageGenerationRequest, 
    options: AIServiceOptions = {}
  ): Promise<ImageGenerationResult> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const providers = this.getImageGenerationProviders()

    for (const provider of providers) {
      try {
        const service = this.services.get(provider)
        if (!service) continue

        const result = await service.generateImage(request)
        
        if (result.success && this.validateImageResult(result, mergedOptions)) {
          return result
        }
      } catch (error) {
        console.error(`Image generation failed for ${provider}:`, error)
        
        if (error instanceof AIServiceError && !error.retryable) {
          continue // Try next provider
        }
      }
    }

    throw new AIServiceError(
      'All image generation providers failed',
      'orchestrator',
      'ALL_PROVIDERS_FAILED',
      false
    )
  }

  /**
   * Get providers that support image generation
   */
  private getImageGenerationProviders(): AIServiceProvider[] {
    const providers: AIServiceProvider[] = []
    
    for (const [provider, config] of this.configs) {
      if (config.enabled && this.services.has(provider)) {
        // Only OpenAI supports image generation currently
        if (provider === 'openai' || provider === 'mock') {
          providers.push(provider)
        }
      }
    }

    // Sort by priority (lower number = higher priority)
    return providers.sort((a, b) => {
      const configA = this.configs.get(a)!
      const configB = this.configs.get(b)!
      return configA.priority - configB.priority
    })
  }

  // =============================================================================
  // Text Generation
  // =============================================================================

  /**
   * Generate text with fallback strategy
   */
  async generateText(
    request: TextGenerationRequest, 
    options: AIServiceOptions = {}
  ): Promise<TextGenerationResult> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const providers = this.getTextGenerationProviders()

    for (const provider of providers) {
      try {
        const service = this.services.get(provider)
        if (!service) continue

        const result = await service.generateText(request)
        
        if (result.success && this.validateTextResult(result, mergedOptions)) {
          return result
        }
      } catch (error) {
        console.error(`Text generation failed for ${provider}:`, error)
        
        if (error instanceof AIServiceError && !error.retryable) {
          continue // Try next provider
        }
      }
    }

    throw new AIServiceError(
      'All text generation providers failed',
      'orchestrator',
      'ALL_PROVIDERS_FAILED',
      false
    )
  }

  /**
   * Get providers that support text generation
   */
  private getTextGenerationProviders(): AIServiceProvider[] {
    const providers: AIServiceProvider[] = []
    
    for (const [provider, config] of this.configs) {
      if (config.enabled && this.services.has(provider)) {
        providers.push(provider)
      }
    }

    // Sort by priority
    return providers.sort((a, b) => {
      const configA = this.configs.get(a)!
      const configB = this.configs.get(b)!
      return configA.priority - configB.priority
    })
  }

  // =============================================================================
  // Content Strategy Generation
  // =============================================================================

  /**
   * Generate content strategy with fallback
   */
  async generateContentStrategy(
    request: ContentStrategyRequest, 
    options: AIServiceOptions = {}
  ): Promise<ContentStrategyResult> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const providers = this.getTextGenerationProviders() // Content strategy uses text generation

    for (const provider of providers) {
      try {
        const service = this.services.get(provider)
        if (!service) continue

        const result = await service.generateContentStrategy(request)
        
        if (result.success && this.validateContentStrategyResult(result, mergedOptions)) {
          return result
        }
      } catch (error) {
        console.error(`Content strategy generation failed for ${provider}:`, error)
        
        if (error instanceof AIServiceError && !error.retryable) {
          continue // Try next provider
        }
      }
    }

    throw new AIServiceError(
      'All content strategy providers failed',
      'orchestrator',
      'ALL_PROVIDERS_FAILED',
      false
    )
  }

  // =============================================================================
  // Validation Methods
  // =============================================================================

  /**
   * Validate image generation result
   */
  private validateImageResult(
    result: ImageGenerationResult, 
    options: AIServiceOptions
  ): boolean {
    // Check cost limit
    if (options.costLimit && result.metadata.cost > options.costLimit) {
      console.warn(`Image generation cost ${result.metadata.cost} exceeds limit ${options.costLimit}`)
      return false
    }

    // Check if image URL is valid
    if (!result.data?.url) {
      console.warn('Image generation result missing URL')
      return false
    }

    return true
  }

  /**
   * Validate text generation result
   */
  private validateTextResult(
    result: TextGenerationResult, 
    options: AIServiceOptions
  ): boolean {
    // Check cost limit
    if (options.costLimit && result.metadata.cost > options.costLimit) {
      console.warn(`Text generation cost ${result.metadata.cost} exceeds limit ${options.costLimit}`)
      return false
    }

    // Check if text is valid
    if (!result.data?.text || result.data.text.trim().length === 0) {
      console.warn('Text generation result is empty')
      return false
    }

    return true
  }

  /**
   * Validate content strategy result
   */
  private validateContentStrategyResult(
    result: ContentStrategyResult, 
    options: AIServiceOptions
  ): boolean {
    // Check cost limit
    if (options.costLimit && result.metadata.cost > options.costLimit) {
      console.warn(`Content strategy cost ${result.metadata.cost} exceeds limit ${options.costLimit}`)
      return false
    }

    // Check if strategy is valid
    if (!result.data?.slides || result.data.slides.length === 0) {
      console.warn('Content strategy result is empty')
      return false
    }

    return true
  }

  // =============================================================================
  // Health Check
  // =============================================================================

  /**
   * Check health of all services
   */
  async healthCheck(): Promise<Partial<Record<AIServiceProvider, boolean>>> {
    const health: Partial<Record<AIServiceProvider, boolean>> = {}

    for (const [provider, service] of this.services) {
      try {
        health[provider] = await service.healthCheck()
      } catch (error) {
        console.error(`Health check failed for ${provider}:`, error)
        health[provider] = false
      }
    }

    return health
  }

  /**
   * Get service statistics
   */
  getServiceStats(): {
    totalServices: number
    availableServices: number
    providers: AIServiceProvider[]
  } {
    const providers = Array.from(this.services.keys())
    const available = providers.filter(provider => {
      const config = this.configs.get(provider)
      return config?.enabled || false
    })

    return {
      totalServices: providers.length,
      availableServices: available.length,
      providers: available
    }
  }

  // =============================================================================
  // Mock Service (for testing)
  // =============================================================================

  private createMockService() {
    return {
      async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
        
        return {
          success: true,
          data: {
            url: `https://picsum.photos/400/400?random=${Date.now()}`,
            revisedPrompt: request.prompt,
            metadata: {
              model: 'mock-dalle-3',
              processingTime: 1000,
              cost: 0.01
            }
          },
          metadata: {
            model: 'mock-dalle-3',
            processingTime: 1000,
            cost: 0.01
          }
        }
      },

      async generateText(request: TextGenerationRequest): Promise<TextGenerationResult> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return {
          success: true,
          data: {
            text: `Mock generated text for: ${request.prompt}`,
            revisedPrompt: request.prompt,
            metadata: {
              model: 'mock-gpt-4',
              processingTime: 500,
              cost: 0.005,
              tokensUsed: 100
            }
          },
          metadata: {
            model: 'mock-gpt-4',
            processingTime: 500,
            cost: 0.005,
            tokensUsed: 100
          }
        }
      },

      async generateContentStrategy(request: ContentStrategyRequest): Promise<ContentStrategyResult> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const slides = Array.from({ length: request.slideCount }, (_, i) => ({
          slideNumber: i + 1,
          title: `Mock Slide ${i + 1}`,
          caption: `Generated caption for slide ${i + 1}`,
          imagePrompt: `Mock image prompt for slide ${i + 1}`,
          keyMessage: `Key message for slide ${i + 1}`
        }))

        return {
          success: true,
          data: {
            slides,
            finalCaption: 'Mock generated carousel content',
            visualTheme: 'professional',
            hashtags: ['#mock', '#generated'],
            callToAction: 'Mock CTA'
          },
          metadata: {
            model: 'mock-gpt-4',
            processingTime: 1000,
            cost: 0.01,
            tokensUsed: 200
          }
        }
      },

      async healthCheck(): Promise<boolean> {
        return true
      }
    }
  }
} 