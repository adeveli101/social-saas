// =============================================================================
// OpenAI Service - DALL-E 3 Integration
// =============================================================================
// Bu dosya OpenAI DALL-E 3 image generation servisini içerir
// =============================================================================

import OpenAI from 'openai'
import type { 
  AIServiceConfig, 
  ImageGenerationRequest, 
  ImageGenerationResult,
  TextGenerationRequest,
  TextGenerationResult,
  ContentStrategyRequest,
  ContentStrategyResult
} from './types'
import { InvalidPromptError, RateLimitError, QuotaExceededError, AIServiceError } from './types'
import { PromptEngineer } from './prompt-templates'

export class OpenAIService {
  private client: OpenAI
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
      timeout: config.timeout,
      maxRetries: config.maxRetries
    })
  }

  // =============================================================================
  // Image Generation (DALL-E 3)
  // =============================================================================

  /**
   * Generate image using DALL-E 3
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const startTime = Date.now()

    try {
      // Generate prompt using template
      const prompt = PromptEngineer.generateImagePrompt(request)
      const sanitizedPrompt = PromptEngineer.sanitizePrompt(prompt)

      // Validate prompt
      if (!this.isValidPrompt(sanitizedPrompt)) {
        throw new InvalidPromptError('openai', 'Content policy violation')
      }

      // Map aspect ratio to DALL-E size
      const size = this.mapAspectRatioToSize(request.aspectRatio)

      // Generate image
      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt: sanitizedPrompt,
        n: request.numberOfImages || 1,
        size: size,
        quality: request.quality === 'hd' ? 'hd' : 'standard',
        response_format: 'url'
      })

      const processingTime = Date.now() - startTime
      const cost = this.calculateImageCost(request.quality === 'hd', size)

      if (!response.data || response.data.length === 0) {
        throw new Error('No image data received from OpenAI')
      }

      return {
        success: true,
        data: {
          url: response.data[0].url!,
          revisedPrompt: response.data[0].revised_prompt,
          metadata: {
            model: 'dall-e-3',
            processingTime,
            cost
          }
        },
        metadata: {
          model: 'dall-e-3',
          processingTime,
          cost
        }
      }

    } catch (error) {
      return this.handleImageError(error, startTime)
    }
  }

  /**
   * Generate text using GPT-4
   */
  async generateText(request: TextGenerationRequest): Promise<TextGenerationResult> {
    const startTime = Date.now()

    try {
      const sanitizedPrompt = PromptEngineer.sanitizePrompt(request.prompt)

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content creator. Provide clear, engaging, and well-structured responses.'
          },
          {
            role: 'user',
            content: sanitizedPrompt
          }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7
      })

      const processingTime = Date.now() - startTime
      const tokensUsed = response.usage?.total_tokens || 0
      const cost = this.calculateTextCost(tokensUsed, 'gpt-4')

      return {
        success: true,
        data: {
          text: response.choices[0].message.content!,
          revisedPrompt: sanitizedPrompt,
          metadata: {
            model: 'gpt-4',
            processingTime,
            cost,
            tokensUsed
          }
        },
        metadata: {
          model: 'gpt-4',
          processingTime,
          cost,
          tokensUsed
        }
      }

    } catch (error) {
      return this.handleTextError(error, startTime)
    }
  }

  /**
   * Generate content strategy using GPT-4
   */
  async generateContentStrategy(request: ContentStrategyRequest): Promise<ContentStrategyResult> {
    const startTime = Date.now()

    try {
      const prompt = PromptEngineer.generateContentStrategyPrompt(request)
      const sanitizedPrompt = PromptEngineer.sanitizePrompt(prompt)

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content strategist. Create engaging carousel content strategies with detailed slide information.'
          },
          {
            role: 'user',
            content: sanitizedPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })

      const content = response.choices[0].message.content!
      const parsedStrategy = this.parseContentStrategy(content, request.slideCount)

      const processingTime = Date.now() - startTime
      const tokensUsed = response.usage?.total_tokens || 0
      const cost = this.calculateTextCost(tokensUsed, 'gpt-4')

      return {
        success: true,
        data: parsedStrategy,
        metadata: {
          model: 'gpt-4',
          processingTime,
          cost,
          tokensUsed
        }
      }

    } catch (error) {
      return this.handleContentStrategyError(error, startTime)
    }
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Map aspect ratio to DALL-E size
   */
  private mapAspectRatioToSize(aspectRatio: string): '1024x1024' | '1792x1024' | '1024x1792' {
    switch (aspectRatio) {
      case '1:1':
        return '1024x1024'
      case '4:5':
        return '1024x1024' // DALL-E doesn't support 4:5, use 1:1
      case '9:16':
        return '1024x1792'
      default:
        return '1024x1024'
    }
  }

  /**
   * Calculate image generation cost
   */
  private calculateImageCost(isHD: boolean, size: string): number {
    // DALL-E 3 pricing (approximate)
    const baseCost = 0.04 // $0.04 per image
    const hdMultiplier = isHD ? 1.5 : 1.0
    
    return baseCost * hdMultiplier
  }

  /**
   * Calculate text generation cost
   */
  private calculateTextCost(tokens: number, model: string): number {
    // GPT-4 pricing (approximate)
    const costPer1kTokens = model === 'gpt-4' ? 0.03 : 0.002
    return (tokens / 1000) * costPer1kTokens
  }

  /**
   * Validate prompt for content policy
   */
  private isValidPrompt(prompt: string): boolean {
    const forbiddenWords = [
      'nude', 'naked', 'explicit', 'porn', 'violence', 'blood', 'gore',
      'hate', 'discrimination', 'illegal', 'weapon', 'drug'
    ]

    const lowerPrompt = prompt.toLowerCase()
    return !forbiddenWords.some(word => lowerPrompt.includes(word))
  }

  /**
   * Parse content strategy response
   */
  private parseContentStrategy(content: string, slideCount: number) {
    // Simple parsing - in production, use more robust parsing
    const lines = content.split('\n')
    const slides: any[] = []
    let finalCaption = ''
    let visualTheme = 'professional'
    let hashtags: string[] = []
    let callToAction = ''

    let currentSlide: any = null

    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('Slide') || trimmed.startsWith('slide')) {
        if (currentSlide) {
          slides.push(currentSlide)
        }
        currentSlide = {
          slideNumber: slides.length + 1,
          title: '',
          caption: '',
          imagePrompt: '',
          keyMessage: ''
        }
      } else if (currentSlide && trimmed.includes('Title:')) {
        currentSlide.title = trimmed.split('Title:')[1]?.trim() || ''
      } else if (currentSlide && trimmed.includes('Caption:')) {
        currentSlide.caption = trimmed.split('Caption:')[1]?.trim() || ''
      } else if (currentSlide && trimmed.includes('Image Prompt:')) {
        currentSlide.imagePrompt = trimmed.split('Image Prompt:')[1]?.trim() || ''
      } else if (trimmed.includes('Final Caption:')) {
        finalCaption = trimmed.split('Final Caption:')[1]?.trim() || ''
      } else if (trimmed.includes('Visual Theme:')) {
        visualTheme = trimmed.split('Visual Theme:')[1]?.trim() || 'professional'
      } else if (trimmed.includes('Hashtags:')) {
        const hashtagText = trimmed.split('Hashtags:')[1]?.trim() || ''
        hashtags = hashtagText.split(' ').filter(tag => tag.startsWith('#'))
      } else if (trimmed.includes('Call to Action:')) {
        callToAction = trimmed.split('Call to Action:')[1]?.trim() || ''
      }
    }

    if (currentSlide) {
      slides.push(currentSlide)
    }

    // Fill remaining slides if needed
    while (slides.length < slideCount) {
      slides.push({
        slideNumber: slides.length + 1,
        title: `Slide ${slides.length + 1}`,
        caption: 'Generated content',
        imagePrompt: 'Professional photography',
        keyMessage: 'Key message'
      })
    }

    return {
      slides,
      finalCaption: finalCaption || 'Generated carousel content',
      visualTheme,
      hashtags,
      callToAction
    }
  }

  // =============================================================================
  // Error Handling
  // =============================================================================

  private handleImageError(error: any, startTime: number): ImageGenerationResult {
    const processingTime = Date.now() - startTime

    if (error.status === 429) {
      throw new RateLimitError('openai', error.headers?.['retry-after'])
    }

    if (error.status === 402) {
      throw new QuotaExceededError('openai')
    }

    if (error.status === 400 && error.message?.includes('content_policy')) {
      throw new InvalidPromptError('openai', error.message)
    }

    throw new AIServiceError(
      `OpenAI image generation failed: ${error.message}`,
      'openai',
      'GENERATION_FAILED',
      true
    )
  }

  private handleTextError(error: any, startTime: number): TextGenerationResult {
    const processingTime = Date.now() - startTime

    if (error.status === 429) {
      throw new RateLimitError('openai', error.headers?.['retry-after'])
    }

    if (error.status === 402) {
      throw new QuotaExceededError('openai')
    }

    throw new AIServiceError(
      `OpenAI text generation failed: ${error.message}`,
      'openai',
      'GENERATION_FAILED',
      true
    )
  }

  private handleContentStrategyError(error: any, startTime: number): ContentStrategyResult {
    const processingTime = Date.now() - startTime

    if (error.status === 429) {
      throw new RateLimitError('openai', error.headers?.['retry-after'])
    }

    if (error.status === 402) {
      throw new QuotaExceededError('openai')
    }

    throw new AIServiceError(
      `OpenAI content strategy generation failed: ${error.message}`,
      'openai',
      'GENERATION_FAILED',
      true
    )
  }

  // =============================================================================
  // Service Health Check
  // =============================================================================

  /**
   * Check if the service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.models.list()
      return true
    } catch (error) {
      console.error('OpenAI health check failed:', error)
      return false
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): AIServiceConfig {
    return this.config
  }
} 