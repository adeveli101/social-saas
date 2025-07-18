'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createBrowserSupabaseClient } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import { Clock, Eye, MoreHorizontal, ExternalLink, Edit, Trash2, Copy } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface RecentCreation {
  id: string
  title: string
  created_at: string
  status: 'draft' | 'published' | 'scheduled'
  type: 'carousel' | 'post' | 'video'
}

export function RecentCreations() {
  const { user, isLoaded } = useUser()
  const [creations, setCreations] = useState<RecentCreation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentCreations() {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        const supabase = createBrowserSupabaseClient()

        // Fetch recent carousels using Clerk user ID
        const { data: carousels, error } = await supabase
          .from('carousels')
          .select('id, prompt, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) {
          console.error('Error fetching recent creations:', error)
          setCreations([])
        } else {
          const formattedCreations: RecentCreation[] = (carousels || []).map(carousel => ({
            id: carousel.id,
            title: carousel.prompt || 'Untitled Carousel',
            created_at: carousel.created_at,
            status: 'published' as const,
            type: 'carousel' as const
          }))
          setCreations(formattedCreations)
        }
      } catch (error) {
        console.error('Error in fetchRecentCreations:', error)
        setCreations([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentCreations()
  }, [user, isLoaded])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      case 'draft':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30'
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'carousel':
        return '🎠'
      case 'post':
        return '📝'
      case 'video':
        return '🎥'
      default:
        return '📄'
    }
  }

  if (!isLoaded || loading) {
    return (
      <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-50">
            <Clock className="h-5 w-5" />
            Recent Creations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-white/10 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                  <div>
                    <div className="w-32 h-4 bg-white/20 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/content-board" className="text-xs text-gray-200 hover:text-white">
              View All
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {creations.length === 0 ? (
          <div className="text-center py-12 px-6 text-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="font-medium mb-2 text-gray-50">No carousels created yet</h3>
            <p className="text-sm mb-4">Start your journey by creating your first AI-powered carousel!</p>
            <Button asChild size="sm">
              <Link href="/carousel">Create First Carousel</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {creations.map((creation, index) => (
              <div
                key={creation.id}
                className="p-4 hover:bg-white/5 transition-colors group animate-in fade-in-0 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-lg flex-shrink-0">
                      {getTypeIcon(creation.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-50 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {creation.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-300">
                          {formatDate(creation.created_at)}
                        </p>
                        <Badge variant="secondary" className={getStatusColor(creation.status)}>
                          {creation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                      <Link href={`/carousel/preview/${creation.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/carousel/preview/${creation.id}`} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Copy className="h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {creations.length > 0 && (
          <div className="p-4 border-t border-[var(--border)]">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/content-board">
                View All Creations
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 