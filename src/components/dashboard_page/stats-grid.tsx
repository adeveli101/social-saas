import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageSquare } from "lucide-react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function StatsGrid({ userId }: { userId: string }) {
  const cookieStore = cookies()
  const supabase = await createClient()

  let stats = [
    { title: "Total Followers", value: 0, change: "+0%", trend: "up", icon: Users, description: "Across all platforms" },
    { title: "Total Views", value: 0, change: "+0%", trend: "up", icon: Eye, description: "Last 30 days" },
    { title: "Engagement Rate", value: "0%", change: "+0%", trend: "up", icon: Heart, description: "Average across platforms" },
    { title: "Comments", value: 0, change: "+0%", trend: "up", icon: MessageSquare, description: "Last 7 days" },
  ]

  if (userId) {
    // Toplam takipçi
    const { data: followersData } = await supabase
      .from('analytics')
      .select('followers')
      .eq('user_id', userId)
    const totalFollowers = followersData?.reduce((sum, row) => sum + (row.followers || 0), 0) || 0
    stats[0].value = totalFollowers.toLocaleString()

    // Toplam görüntülenme
    const { data: viewsData } = await supabase
      .from('analytics')
      .select('impressions')
      .eq('user_id', userId)
    const totalViews = viewsData?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0
    stats[1].value = totalViews.toLocaleString()

    // Engagement rate (örnek: toplam engagement / toplam impressions)
    const { data: engagementData } = await supabase
      .from('analytics')
      .select('engagement, impressions')
      .eq('user_id', userId)
    const totalEngagement = engagementData?.reduce((sum, row) => sum + (row.engagement || 0), 0) || 0
    const totalImpressions = engagementData?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0
    stats[2].value = totalImpressions > 0 ? `${((totalEngagement / totalImpressions) * 100).toFixed(1)}%` : "0%"

    // Yorum sayısı (örnek: activities tablosunda type = 'comment')
    const { count: commentsCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('type', 'comment')
    stats[3].value = commentsCount || 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-background border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="flex items-center space-x-2 mt-2">
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-[#22c55e]" />
              ) : (
                <TrendingDown className="h-4 w-4 text-[#ef4444]" />
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  stat.trend === "up" 
                    ? "text-[#22c55e] border-[#22c55e]/20 bg-[#22c55e]/10" 
                    : "text-[#ef4444] border-[#ef4444]/20 bg-[#ef4444]/10"
                }`}
              >
                {stat.change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 