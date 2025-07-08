'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTodos, getTodoStats } from '@/lib/todo'
import { CheckCircle, Clock, AlertTriangle, Target, Loader2 } from 'lucide-react'

interface TodoStatsProps {
  userId: string
}

export function TodoStats({ userId }: TodoStatsProps) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    try {
      setLoading(true)
      const todos = await getTodos(userId)
      const todoStats = getTodoStats(todos)
      setStats(todoStats)
    } catch (error) {
      console.error('Error loading todo stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [userId])

  if (loading) {
    return (
      <Card className="bg-background border-border">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 heading-gradient heading">
            <Target className="h-5 w-5 text-primary" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="text-2xl font-bold heading-gradient heading">
              {stats.completionRate}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <span className="text-xl font-bold text-green-600">{stats.completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <span className="text-xl font-bold text-yellow-600">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-muted-foreground">High Priority</span>
              </div>
              <span className="text-xl font-bold text-red-600">{stats.highPriority}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-sm heading-gradient heading">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground">
            • Click checkbox to mark complete
          </div>
          <div className="text-xs text-muted-foreground">
            • Use filters to organize tasks
          </div>
          <div className="text-xs text-muted-foreground">
            • Set due dates for reminders
          </div>
          <div className="text-xs text-muted-foreground">
            • Prioritize important tasks
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 