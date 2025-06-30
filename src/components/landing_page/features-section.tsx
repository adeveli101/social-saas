import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Zap, 
  Shield,
  TrendingUp,
  Smartphone
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts across multiple platforms with our intelligent timing algorithm.",
    badge: "Popular"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance with detailed analytics and insights for each platform.",
    badge: "New"
  },
  {
    icon: MessageSquare,
    title: "Content Calendar",
    description: "Plan and organize your content with our visual calendar interface.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team on content creation and approval workflows.",
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    description: "Get AI recommendations for optimal posting times and content strategies.",
    badge: "AI"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with SSO, 2FA, and compliance certifications.",
  },
  {
    icon: TrendingUp,
    title: "Growth Analytics",
    description: "Monitor follower growth, engagement rates, and audience insights.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Manage your social media on the go with our native mobile apps.",
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-surface-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-surface-primary text-text-secondary border-surface-border">
            Features
          </Badge>
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Powerful tools designed to help you grow your social media presence 
            and engage with your audience effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-surface-primary border-surface-border hover:border-primary-600/50 transition-colors group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  {feature.badge && (
                    <Badge variant="outline" className="text-xs border-surface-border text-text-tertiary">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-text-primary mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 