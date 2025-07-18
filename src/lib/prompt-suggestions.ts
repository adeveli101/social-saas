// src/lib/prompt-suggestions.ts

export const TOPIC_SUGGESTIONS = [
  "Digital marketing trends",
  "Healthy lifestyle tips",
  "Startup growth hacks",
  "Personal finance basics",
  "Remote work productivity",
  "Social media content ideas",
  "Brand storytelling",
  "E-commerce strategies",
];

export const AUDIENCE_SUGGESTIONS = [
  "Small business owners",
  "Freelancers",
  "Content creators",
  "Students",
  "Parents",
  "Entrepreneurs",
  "Marketing professionals",
  "Fitness enthusiasts",
];

export const KEYPOINT_GROUPS = [
  {
    groupName: 'E-commerce Suggestions',
    suggestions: ['Conversion', 'Retention', 'Shipping', 'Analytics', 'Inventory', 'Customer service']
  },
  {
    groupName: 'Health-themed Suggestions',
    suggestions: ['Exercise', 'Nutrition', 'Mental health', 'Sleep', 'Wellness', 'Habits']
  },
  {
    groupName: 'General Popular Topics',
    suggestions: ['Social media', 'Content strategy', 'Branding', 'Engagement', 'SEO', 'Time management', 'Growth mindset']
  }
];

// Contextual suggestions based on main topic
export const CONTEXTUAL_SUGGESTIONS: { [key: string]: { audience: string[]; keyPoints: string[] } } = {
    "Digital marketing trends": {
        audience: ["Marketing professionals", "Small business owners", "Startup founders"],
        keyPoints: ["SEO", "Content Marketing", "Social Media Advertising", "Email Marketing", "AI in Marketing"]
    },
    "Healthy lifestyle tips": {
        audience: ["Fitness enthusiasts", "Parents", "Busy professionals"],
        keyPoints: ["Meal prep", "Mindfulness", "Home workouts", "Sleep hygiene", "Stress management"]
    },
};

export const CLASSIC_PROMPT_TEMPLATES = [
  {
    label: "Weekly Tips",
    example: "Create a carousel with actionable productivity tips for remote workers. Each slide should have a catchy title, a short tip, and a one-sentence explanation. The tone should be friendly and motivating."
  },
  {
    label: "Product Promotion",
    example: "Generate a carousel to promote our new eco-friendly water bottle. Highlight unique features (one per slide), include a customer testimonial, and end with a call-to-action. Tone: enthusiastic and persuasive."
  },
  {
    label: "Listicle",
    example: "Create a carousel listing '5 Must-Read Books for Aspiring Entrepreneurs'. Each slide should feature the book title, author, and a one-sentence reason why it's recommended. Tone: informative and inspiring."
  },
  {
    label: "How-To Guide",
    example: "Generate a carousel explaining how to create engaging social media carousels. Each slide should cover one step, with a clear title, and a practical tip. Tone: educational and supportive."
  },
]; 