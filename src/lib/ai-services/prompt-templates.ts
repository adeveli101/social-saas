// =============================================================================
// Prompt Engineering System
// =============================================================================
// Bu dosya AI servisleri için prompt template'lerini ve engineering sistemini içerir
// =============================================================================

import type { 
  PromptTemplate, 
  PromptVariable, 
  AIServiceProvider,
  ContentStrategyRequest,
  ImageGenerationRequest
} from './types'

// =============================================================================
// Base Prompt Templates
// =============================================================================

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  // =============================================================================
  // Content Strategy Templates
  // =============================================================================
  
  'content-strategy-professional': {
    id: 'content-strategy-professional',
    name: 'Professional Content Strategy',
    description: 'Creates professional content strategy for business audiences',
    template: `Create a professional content strategy for a carousel about "{topic}" targeting {audience}.

Purpose: {purpose}
Key Points: {keyPoints}
Number of Slides: {slideCount}

For each slide, provide:
1. Slide Number
2. Title (concise, professional)
3. Caption (engaging, informative)
4. Image Prompt (detailed, professional photography style)
5. Key Message (main takeaway)

Style: Professional, business-focused, clean design
Tone: Authoritative, trustworthy, informative

Final Output Format:
- Final Caption: Professional summary with hashtags
- Visual Theme: Professional, clean, modern
- Hashtags: Relevant business hashtags
- Call to Action: Professional CTA`,
    variables: ['topic', 'audience', 'purpose', 'keyPoints', 'slideCount'],
    category: 'content',
    provider: 'openai',
    version: '1.0',
    createdAt: '2024-12-30T00:00:00Z',
    updatedAt: '2024-12-30T00:00:00Z'
  },

  'content-strategy-creative': {
    id: 'content-strategy-creative',
    name: 'Creative Content Strategy',
    description: 'Creates creative and engaging content strategy',
    template: `Create a creative and engaging content strategy for a carousel about "{topic}" targeting {audience}.

Purpose: {purpose}
Key Points: {keyPoints}
Number of Slides: {slideCount}

For each slide, provide:
1. Slide Number
2. Title (creative, catchy)
3. Caption (engaging, shareable)
4. Image Prompt (creative, artistic style)
5. Key Message (memorable takeaway)

Style: Creative, visually appealing, modern
Tone: Friendly, inspiring, relatable

Final Output Format:
- Final Caption: Creative summary with trending hashtags
- Visual Theme: Creative, vibrant, modern
- Hashtags: Trending and relevant hashtags
- Call to Action: Engaging CTA`,
    variables: ['topic', 'audience', 'purpose', 'keyPoints', 'slideCount'],
    category: 'content',
    provider: 'openai',
    version: '1.0',
    createdAt: '2024-12-30T00:00:00Z',
    updatedAt: '2024-12-30T00:00:00Z'
  },

  // =============================================================================
  // Image Generation Templates
  // =============================================================================

  'image-generation-professional': {
    id: 'image-generation-professional',
    name: 'Professional Image Generation',
    description: 'Generates professional, business-style images',
    template: `Create a professional, high-quality image for business content.

Topic: {topic}
Style: Professional photography
Aspect Ratio: {aspectRatio}
Quality: {quality}

Requirements:
- Professional, clean design
- Business-appropriate imagery
- High-quality, modern aesthetic
- Suitable for social media
- Professional color palette
- Clear, readable elements

Style Guidelines:
- Clean, minimalist design
- Professional color scheme
- Modern typography
- High contrast for readability
- Business-appropriate imagery`,
    variables: ['topic', 'aspectRatio', 'quality'],
    category: 'image',
    provider: 'openai',
    version: '1.0',
    createdAt: '2024-12-30T00:00:00Z',
    updatedAt: '2024-12-30T00:00:00Z'
  },

  'image-generation-creative': {
    id: 'image-generation-creative',
    name: 'Creative Image Generation',
    description: 'Generates creative and artistic images',
    template: `Create a creative, artistic image for engaging content.

Topic: {topic}
Style: Creative, artistic
Aspect Ratio: {aspectRatio}
Quality: {quality}

Requirements:
- Creative, eye-catching design
- Artistic, modern aesthetic
- Vibrant, engaging colors
- Suitable for social media
- Memorable visual impact
- Trendy design elements

Style Guidelines:
- Creative, artistic approach
- Vibrant color palette
- Modern design trends
- Engaging visual elements
- Shareable, viral potential`,
    variables: ['topic', 'aspectRatio', 'quality'],
    category: 'image',
    provider: 'openai',
    version: '1.0',
    createdAt: '2024-12-30T00:00:00Z',
    updatedAt: '2024-12-30T00:00:00Z'
  },

  // =============================================================================
  // Caption Generation Templates
  // =============================================================================

  'caption-generation-professional': {
    id: 'caption-generation-professional',
    name: 'Professional Caption Generation',
    description: 'Generates professional captions for business content',
    template: `Create a professional caption for a carousel about "{topic}".

Content: {content}
Audience: {audience}
Purpose: {purpose}

Requirements:
- Professional tone
- Clear, concise messaging
- Business-appropriate language
- Engaging but professional
- Include relevant hashtags
- Professional call to action

Style: Professional, authoritative, trustworthy
Length: 2-3 sentences + hashtags`,
    variables: ['topic', 'content', 'audience', 'purpose'],
    category: 'caption',
    provider: 'openai',
    version: '1.0',
    createdAt: '2024-12-30T00:00:00Z',
    updatedAt: '2024-12-30T00:00:00Z'
  },

  'caption-generation-creative': {
    id: 'caption-generation-creative',
    name: 'Creative Caption Generation',
    description: 'Generates creative and engaging captions',
    template: `Create a creative, engaging caption for a carousel about "{topic}".

Content: {content}
Audience: {audience}
Purpose: {purpose}

Requirements:
- Creative, engaging tone
- Memorable messaging
- Shareable content
- Trending hashtags
- Engaging call to action
- Relatable language

Style: Creative, friendly, inspiring
Length: 2-3 sentences + hashtags`,
    variables: ['topic', 'content', 'audience', 'purpose'],
    category: 'caption',
    provider: 'openai',
    version: '1.0',
    createdAt: '2024-12-30T00:00:00Z',
    updatedAt: '2024-12-30T00:00:00Z'
  }
}

// =============================================================================
// Prompt Variables Definitions
// =============================================================================

export const PROMPT_VARIABLES: Record<string, PromptVariable> = {
  topic: {
    name: 'topic',
    type: 'string',
    required: true,
    description: 'The main topic or theme of the content'
  },
  audience: {
    name: 'audience',
    type: 'select',
    required: true,
    options: ['business', 'entrepreneurs', 'professionals', 'students', 'general'],
    description: 'Target audience for the content'
  },
  purpose: {
    name: 'purpose',
    type: 'select',
    required: true,
    options: ['educate', 'inspire', 'sell', 'inform', 'entertain'],
    description: 'Purpose of the content'
  },
  keyPoints: {
    name: 'keyPoints',
    type: 'array',
    required: true,
    description: 'Key points to cover in the content'
  },
  slideCount: {
    name: 'slideCount',
    type: 'number',
    required: true,
    defaultValue: 5,
    description: 'Number of slides to create'
  },
  aspectRatio: {
    name: 'aspectRatio',
    type: 'select',
    required: true,
    options: ['1:1', '4:5', '9:16'],
    defaultValue: '1:1',
    description: 'Aspect ratio for images'
  },
  quality: {
    name: 'quality',
    type: 'select',
    required: false,
    options: ['standard', 'hd'],
    defaultValue: 'standard',
    description: 'Image quality setting'
  },
  content: {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Content to create caption for'
  }
}

// =============================================================================
// Prompt Engineering Functions
// =============================================================================

export class PromptEngineer {
  /**
   * Get a prompt template by ID
   */
  static getTemplate(templateId: string): PromptTemplate | null {
    return PROMPT_TEMPLATES[templateId] || null;
  }

  /**
   * Get all templates for a specific category
   */
  static getTemplatesByCategory(category: string): PromptTemplate[] {
    return Object.values(PROMPT_TEMPLATES).filter(
      template => template.category === category
    );
  }

  /**
   * Get all templates for a specific provider
   */
  static getTemplatesByProvider(provider: AIServiceProvider): PromptTemplate[] {
    return Object.values(PROMPT_TEMPLATES).filter(
      template => template.provider === provider
    );
  }

  /**
   * Render a prompt template with variables
   */
  static renderTemplate(
    templateId: string, 
    variables: Record<string, any>
  ): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let rendered = template.template;

    // Replace variables in template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      if (rendered.includes(placeholder)) {
        if (Array.isArray(value)) {
          rendered = rendered.replace(placeholder, value.join(', '));
        } else {
          rendered = rendered.replace(placeholder, String(value));
        }
      }
    }

    return rendered;
  }

  /**
   * Validate variables against template requirements
   */
  static validateVariables(
    templateId: string, 
    variables: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { valid: false, errors: [`Template ${templateId} not found`] };
    }

    const errors: string[] = [];

    for (const variableName of template.variables) {
      const variable = PROMPT_VARIABLES[variableName];
      if (!variable) {
        errors.push(`Unknown variable: ${variableName}`);
        continue;
      }

      if (variable.required && !variables[variableName]) {
        errors.push(`Required variable missing: ${variableName}`);
        continue;
      }

      if (variables[variableName] !== undefined) {
        // Type validation
        if (variable.type === 'number' && isNaN(Number(variables[variableName]))) {
          errors.push(`Variable ${variableName} must be a number`);
        }

        if (variable.type === 'select' && variable.options) {
          if (!variable.options.includes(variables[variableName])) {
            errors.push(`Variable ${variableName} must be one of: ${variable.options.join(', ')}`);
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generate content strategy prompt
   */
  static generateContentStrategyPrompt(request: ContentStrategyRequest): string {
    const templateId = request.style === 'creative' 
      ? 'content-strategy-creative' 
      : 'content-strategy-professional';

    return this.renderTemplate(templateId, {
      topic: request.topic,
      audience: request.audience,
      purpose: request.purpose,
      keyPoints: request.keyPoints.join(', '),
      slideCount: request.slideCount
    });
  }

  /**
   * Generate image generation prompt
   */
  static generateImagePrompt(request: ImageGenerationRequest): string {
    const templateId = request.style === 'creative' 
      ? 'image-generation-creative' 
      : 'image-generation-professional';

    return this.renderTemplate(templateId, {
      topic: request.prompt,
      aspectRatio: request.aspectRatio,
      quality: request.quality || 'standard'
    });
  }

  /**
   * Generate caption prompt
   */
  static generateCaptionPrompt(
    topic: string,
    content: string,
    audience: string,
    purpose: string,
    style: 'professional' | 'creative' = 'professional'
  ): string {
    const templateId = style === 'creative' 
      ? 'caption-generation-creative' 
      : 'caption-generation-professional';

    return this.renderTemplate(templateId, {
      topic,
      content,
      audience,
      purpose
    });
  }

  /**
   * Sanitize prompt for AI service
   */
  static sanitizePrompt(prompt: string): string {
    return prompt
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Add context to prompt
   */
  static addContext(
    prompt: string, 
    context: Record<string, any>
  ): string {
    const contextStr = Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    return `${prompt}\n\nContext:\n${contextStr}`;
  }
} 