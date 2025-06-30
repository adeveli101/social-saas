import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Heart, Share, Eye } from "lucide-react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const iconMap = {
  comment: MessageSquare,
  like: Heart,
  share: Share,
  view: Eye,
}

export async function ActivitySection({ userId }: { userId: string }) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  let activities = []
  if (userId) {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    activities = data || []
  }

  return (
    <Card className="bg-surface-primary border-surface-border">
      <CardHeader>
        <CardTitle className="text-text-primary">Recent Activity</CardTitle>
        <CardDescription className="text-text-secondary">
          Latest interactions with your content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <div className="text-center text-text-tertiary py-8">No recent activity found.</div>
          )}
          {activities.map((activity) => {
            const Icon = iconMap[activity.type] || MessageSquare
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar} alt={activity.user} />
                  <AvatarFallback className="bg-surface-secondary text-text-primary">
                    {activity.user?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-text-primary">{activity.user}</span>
                    <Badge variant="outline" className="text-xs border-surface-border text-text-tertiary">
                      {activity.platform}
                    </Badge>
                    <span className="text-xs text-text-tertiary">{activity.time || activity.created_at}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{activity.content}</p>
                  <div className="flex items-center space-x-1">
                    <Icon className={`h-4 w-4`} />
                    <span className="text-xs text-text-tertiary capitalize">{activity.type}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 