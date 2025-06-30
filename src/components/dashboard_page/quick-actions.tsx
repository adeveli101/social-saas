import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, BarChart3, Settings, MessageSquare, Image } from "lucide-react"

const actions = [
  {
    title: "Create Post",
    description: "Draft a new social media post",
    icon: Plus,
    color: "bg-primary-600 hover:bg-primary-700",
    href: "/dashboard/create"
  },
  {
    title: "Schedule Content",
    description: "Plan your content calendar",
    icon: Calendar,
    color: "bg-blue-600 hover:bg-blue-700",
    href: "/dashboard/schedule"
  },
  {
    title: "View Analytics",
    description: "Check your performance metrics",
    icon: BarChart3,
    color: "bg-green-600 hover:bg-green-700",
    href: "/dashboard/analytics"
  },
  {
    title: "Manage Accounts",
    description: "Connect or disconnect platforms",
    icon: Settings,
    color: "bg-purple-600 hover:bg-purple-700",
    href: "/dashboard/accounts"
  },
  {
    title: "Respond to Comments",
    description: "Engage with your audience",
    icon: MessageSquare,
    color: "bg-orange-600 hover:bg-orange-700",
    href: "/dashboard/comments"
  },
  {
    title: "Upload Media",
    description: "Add images and videos to your library",
    icon: Image,
    color: "bg-pink-600 hover:bg-pink-700",
    href: "/dashboard/media"
  }
]

export function QuickActions() {
  return (
    <Card className="bg-surface-primary border-surface-border">
      <CardHeader>
        <CardTitle className="text-text-primary">Quick Actions</CardTitle>
        <CardDescription className="text-text-secondary">
          Common tasks to help you manage your social media
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`h-auto p-4 flex flex-col items-start space-y-2 text-left border border-surface-border hover:border-primary-600/50 transition-colors ${action.color} text-white hover:scale-105`}
            >
              <action.icon className="h-6 w-6" />
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 