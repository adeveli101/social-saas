// Dinamik ve bağlamsal öneriler sistemi
export interface SuggestionGroup {
  id: string
  label: string
  suggestions: string[]
  color: string
}

export interface ContextualSuggestions {
  [key: string]: {
    mainTopic: string[]
    audience: string[]
    keyPoints: string[]
  }
}

// Ana konu seçimlerine göre dinamik öneriler
export const CONTEXTUAL_SUGGESTIONS: ContextualSuggestions = {
  "Digital marketing trends": {
    mainTopic: ["AI in marketing", "Video content", "Social commerce", "Influencer marketing"],
    audience: ["Marketing professionals", "Small business owners", "Content creators", "Entrepreneurs"],
    keyPoints: ["SEO", "Video content", "AI in marketing", "Social commerce", "Analytics", "Branding"]
  },
  "Healthy lifestyle tips": {
    mainTopic: ["Nutrition basics", "Workout routines", "Mental health", "Sleep optimization"],
    audience: ["Fitness enthusiasts", "Busy professionals", "Parents", "Students"],
    keyPoints: ["Nutrition", "Exercise", "Mental health", "Sleep", "Wellness", "Habits"]
  },
  "Startup growth hacks": {
    mainTopic: ["Product-market fit", "Customer acquisition", "Funding strategies", "Team building"],
    audience: ["Entrepreneurs", "Startup founders", "Investors", "Business students"],
    keyPoints: ["Growth", "Marketing", "Funding", "Product", "Team", "Strategy"]
  },
  "Personal finance basics": {
    mainTopic: ["Budgeting", "Investing", "Debt management", "Emergency funds"],
    audience: ["Young professionals", "Students", "Families", "Retirees"],
    keyPoints: ["Budgeting", "Investing", "Saving", "Debt", "Taxes", "Insurance"]
  },
  "Remote work productivity": {
    mainTopic: ["Time management", "Work-life balance", "Home office setup", "Team collaboration"],
    audience: ["Remote workers", "Freelancers", "Managers", "Teams"],
    keyPoints: ["Time management", "Communication", "Tools", "Balance", "Focus", "Collaboration"]
  },
  "Instagram content ideas": {
    mainTopic: ["Story strategies", "Reel trends", "Carousel formats", "Engagement tactics"],
    audience: ["Content creators", "Small businesses", "Influencers", "Brands"],
    keyPoints: ["Stories", "Reels", "Carousels", "Engagement", "Hashtags", "Analytics"]
  },
  "Brand storytelling": {
    mainTopic: ["Brand voice", "Visual identity", "Customer stories", "Mission statements"],
    audience: ["Brand managers", "Marketing teams", "Small businesses", "Agencies"],
    keyPoints: ["Voice", "Identity", "Stories", "Values", "Messaging", "Consistency"]
  },
  "E-commerce strategies": {
    mainTopic: ["Conversion optimization", "Customer retention", "Inventory management", "Shipping strategies"],
    audience: ["E-commerce owners", "Online sellers", "Dropshippers", "Retailers"],
    keyPoints: ["Conversion", "Retention", "Inventory", "Shipping", "Analytics", "Customer service"]
  }
}

export type TemplateCategory =
  | 'Marketing'
  | 'Personal Growth'
  | 'E-commerce'
  | 'Education'
  | 'Inspiration'
  | 'Other'

export interface UserTemplate {
  id: string
  name: string
  mainTopic: string
  audience: string
  purpose: string
  keyPoints: string[]
  category: TemplateCategory
  createdAt: Date
  usageCount: number
}

export const DEFAULT_CATEGORIES: TemplateCategory[] = [
  'Marketing',
  'Personal Growth',
  'E-commerce',
  'Education',
  'Inspiration',
  'Other',
]

import templatesData from '../data/templates.json'

export const getDefaultTemplates = async (): Promise<UserTemplate[]> => {
  // JSON dosyasından okunan veriyi UserTemplate tipine cast et
  return templatesData as UserTemplate[]
}

export const getTemplates = async (): Promise<UserTemplate[]> => {
  try {
    // Local storage'dan geçici olarak al
    const savedTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]')
    const defaultTemplates = await getDefaultTemplates()
    return [...defaultTemplates, ...savedTemplates]
  } catch (error) {
    console.error('Template getirme hatası:', error)
    return []
  }
}

// Şablon kullanım sayısını artırma
export const incrementTemplateUsage = async (templateId: string) => {
  try {
    const templates = await getTemplates()
    const updatedTemplates = templates.map(template => 
      template.id === templateId 
        ? { ...template, usageCount: template.usageCount + 1 }
        : template
    )
    
    // Local storage'ı güncelle
    const userTemplates = updatedTemplates.filter(t => !DEFAULT_CATEGORIES.find(dt => dt === t.category))
    localStorage.setItem('userTemplates', JSON.stringify(userTemplates))
    
    return updatedTemplates.find(t => t.id === templateId)
  } catch (error) {
    console.error('Template kullanım sayısı güncelleme hatası:', error)
  }
} 

type SaveTemplateInput = Omit<UserTemplate, 'id' | 'createdAt' | 'usageCount'>
export const saveTemplate = async (template: SaveTemplateInput) => {
  try {
    const newTemplate: UserTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
      usageCount: 0
    }
    const savedTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]')
    savedTemplates.push(newTemplate)
    localStorage.setItem('userTemplates', JSON.stringify(savedTemplates))
    return newTemplate
  } catch (error) {
    console.error('Template kaydetme hatası:', error)
    throw error
  }
} 