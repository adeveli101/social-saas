// =============================================================================
// Google Gemini Service - Gemini Pro Integration
// =============================================================================
// Bu dosya Google Gemini Pro text generation servisini içerir
// =============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { 
  AIServiceConfig, 
  TextGenerationRequest,
  TextGenerationResult,
  ContentStrategyRequest,
  ContentStrategyResult,
  AIServiceError,
  RateLimitError,
  QuotaExceededError,
  InvalidPromptError
} from './types'
import { PromptEngineer } from './prompt-templates'

export class GeminiService {
  private client: GoogleGenerativeAI
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
    this.client = new GoogleGenerativeAI(config.apiKey)
  }

  // =============================================================================
  // Text Generation (Gemini Pro)
  // =============================================================================

  /**
   * Generate text using Gemini Pro
   */
  async generateText(request: TextGenerationRequest): Promise<TextGenerationResult> {
    const startTime = Date.now()

    try {
      const sanitizedPrompt = PromptEngineer.sanitizePrompt(request.prompt)

      // Validate prompt
      if (!this.isValidPrompt(sanitizedPrompt)) {
        throw new InvalidPromptError('gemini', 'Content policy violation')
      }

      const model = this.client.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          maxOutputTokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7
        }
      })

      const result = await model.generateContent(sanitizedPrompt)
      const response = await result.response
      const text = response.text()

      const processingTime = Date.now() - startTime
      const tokensUsed = this.estimateTokenCount(sanitizedPrompt + text)
      const cost = this.calculateTextCost(tokensUsed)

      return {
        success: true,
        data: {
          text,
          revisedPrompt: sanitizedPrompt,
          metadata: {
            model: 'gemini-pro',
            processingTime,
            cost,
            tokensUsed
          }
        },
        metadata: {
          model: 'gemini-pro',
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
   * Generate content strategy using Gemini Pro
   */
  async generateContentStrategy(request: ContentStrategyRequest): Promise<ContentStrategyResult> {
    const startTime = Date.now()

    try {
      const prompt = PromptEngineer.generateContentStrategyPrompt(request)
      const sanitizedPrompt = PromptEngineer.sanitizePrompt(prompt)

      const model = this.client.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7
        }
      })

      const result = await model.generateContent(sanitizedPrompt)
      const response = await result.response
      const content = response.text()

      const parsedStrategy = this.parseContentStrategy(content, request.slideCount)

      const processingTime = Date.now() - startTime
      const tokensUsed = this.estimateTokenCount(sanitizedPrompt + content)
      const cost = this.calculateTextCost(tokensUsed)

      return {
        success: true,
        data: parsedStrategy,
        metadata: {
          model: 'gemini-pro',
          processingTime,
          cost,
          tokensUsed
        }
      }

    } catch (error) {
      return this.handleContentStrategyError(error, startTime)
    }
  }

  /**
   * Generate creative captions using Gemini Pro
   */
  async generateCreativeCaption(
    topic: string,
    content: string,
    audience: string,
    purpose: string
  ): Promise<TextGenerationResult> {
    const startTime = Date.now()

    try {
      const prompt = PromptEngineer.generateCaptionPrompt(
        topic, content, audience, purpose, 'creative'
      )
      const sanitizedPrompt = PromptEngineer.sanitizePrompt(prompt)

      const model = this.client.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8 // Higher creativity
        }
      })

      const result = await model.generateContent(sanitizedPrompt)
      const response = await result.response
      const text = response.text()

      const processingTime = Date.now() - startTime
      const tokensUsed = this.estimateTokenCount(sanitizedPrompt + text)
      const cost = this.calculateTextCost(tokensUsed)

      return {
        success: true,
        data: {
          text,
          revisedPrompt: sanitizedPrompt,
          metadata: {
            model: 'gemini-pro',
            processingTime,
            cost,
            tokensUsed
          }
        },
        metadata: {
          model: 'gemini-pro',
          processingTime,
          cost,
          tokensUsed
        }
      }

    } catch (error) {
      return this.handleTextError(error, startTime)
    }
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Estimate token count (approximate)
   */
  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  /**
   * Calculate text generation cost
   */
  private calculateTextCost(tokens: number): number {
    // Gemini Pro pricing (approximate)
    const costPer1kTokens = 0.0005 // $0.0005 per 1K tokens
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

  private handleTextError(error: any, startTime: number): TextGenerationResult {
    const processingTime = Date.now() - startTime

    if (error.status === 429) {
      throw new RateLimitError('gemini', error.headers?.['retry-after'])
    }

    if (error.status === 402) {
      throw new QuotaExceededError('gemini')
    }

    if (error.message?.includes('SAFETY')) {
      throw new InvalidPromptError('gemini', error.message)
    }

    throw new AIServiceError(
      `Gemini text generation failed: ${error.message}`,
      'gemini',
      'GENERATION_FAILED',
      true
    )
  }

  private handleContentStrategyError(error: any, startTime: number): ContentStrategyResult {
    const processingTime = Date.now() - startTime

    if (error.status === 429) {
      throw new RateLimitError('gemini', error.headers?.['retry-after'])
    }

    if (error.status === 402) {
      throw new QuotaExceededError('gemini')
    }

    if (error.message?.includes('SAFETY')) {
      throw new InvalidPromptError('gemini', error.message)
    }

    throw new AIServiceError(
      `Gemini content strategy generation failed: ${error.message}`,
      'gemini',
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
      const model = this.client.getGenerativeModel({ model: 'gemini-pro' })
      await model.generateContent('Hello')
      return true
    } catch (error) {
      console.error('Gemini health check failed:', error)
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