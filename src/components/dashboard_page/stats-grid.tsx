'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createBrowserSupabaseClient } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import { BarChart3, Clock, Zap, Image } from 'lucide-react'

interface Stats {
  totalCarousels: number
  totalSlides: number
  recentCreations: number
  avgSlidesPerCarousel: number
}

export function StatsGrid() {
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState<Stats>({
    totalCarousels: 0,
    totalSlides: 0,
    recentCreations: 0,
    avgSlidesPerCarousel: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        const supabase = createBrowserSupabaseClient()
        
        // Fetch total carousels using Clerk user ID
        const { count: carouselCount } = await supabase
          .from('carousels')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Fetch total slides
        const { data: carousels } = await supabase
          .from('carousels')
          .select('id')
          .eq('user_id', user.id)

        let totalSlides = 0
        if (carousels && carousels.length > 0) {
          const carouselIds = carousels.map(c => c.id)
          const { count: slidesCount } = await supabase
            .from('carousel_slides')
            .select('*', { count: 'exact', head: true })
            .in('carousel_id', carouselIds)
          totalSlides = slidesCount || 0
        }

        // Recent creations (last 7 days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const { count: recentCount } = await supabase
          .from('carousels')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString())

        const avgSlides = carouselCount && carouselCount > 0 
          ? Math.round(totalSlides / carouselCount) 
          : 0

        setStats({
          totalCarousels: carouselCount || 0,
          totalSlides,
          recentCreations: recentCount || 0,
          avgSlidesPerCarousel: avgSlides
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, isLoaded])

  const statCards = [
    {
      title: 'Total Carousels',
      value: stats.totalCarousels,
      icon: BarChart3,
      description: 'AI-generated carousels',
      color: 'text-blue-500',
      bgGradient: 'from-blue-500/10 to-blue-600/10'
    },
    {
      title: 'Total Slides',
      value: stats.totalSlides,
      icon: Image,
      description: 'Generated slide images',
      color: 'text-green-500',
      bgGradient: 'from-green-500/10 to-emerald-600/10'
    },
    {
      title: 'This Week',
      value: stats.recentCreations,
      icon: Clock,
      description: 'New carousels created',
      color: 'text-purple-500',
      bgGradient: 'from-purple-500/10 to-violet-600/10'
    },
    {
      title: 'Avg Slides',
      value: stats.avgSlidesPerCarousel || '-',
      icon: Zap,
      description: 'Per carousel',
      color: 'text-orange-500',
      bgGradient: 'from-orange-500/10 to-red-600/10'
    }
  ]

  if (!isLoaded || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-glass backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-white/20 rounded w-24 animate-pulse"></div>
              <div className="h-4 w-4 bg-white/20 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-white/20 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-3 bg-white/20 rounded w-20 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="animate-in fade-in-0 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className="bg-glass backdrop-blur-sm border-white/10 hover:border-blue-400/30 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-200">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-gray-50 mb-1">{stat.value}</div>
                <p className="text-xs text-gray-300">{stat.description}</p>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
} 