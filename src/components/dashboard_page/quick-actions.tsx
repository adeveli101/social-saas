'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, BarChart3, Settings, MessageSquare, Image, CheckSquare } from "lucide-react"
import Link from 'next/link'
import { cn } from "@/lib/utils"

const actions = [
  {
    title: "Create Post",
    description: "Draft a new social media post",
    icon: Plus,
    color: "from-[#f5e9da] to-[#e9e4d0]",
    href: "/dashboard/create"
  },
  {
    title: "Todo Management",
    description: "Organize your tasks and stay productive",
    icon: CheckSquare,
    color: "from-[#f3ede7] to-[#e7e3d8]",
    href: "/todo"
  },
  {
    title: "Schedule Content",
    description: "Plan your content calendar",
    icon: Calendar,
    color: "from-[#f6f3ee] to-[#eae6db]",
    href: "/dashboard/schedule"
  },
  {
    title: "View Analytics",
    description: "Check your performance metrics",
    icon: BarChart3,
    color: "from-[#f3f0ea] to-[#e7e3d8]",
    href: "/dashboard/analytics"
  },
  {
    title: "Manage Accounts",
    description: "Connect or disconnect platforms",
    icon: Settings,
    color: "from-[#f7f3ed] to-[#eae6db]",
    href: "/dashboard/accounts"
  },
  {
    title: "Respond to Comments",
    description: "Engage with your audience",
    icon: MessageSquare,
    color: "from-[#f5ece2] to-[#e9e4d0]",
    href: "/dashboard/comments"
  }
]

export function QuickActions() {
  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
        <CardDescription className="text-muted-foreground">
          Common tasks to help you manage your social media
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href} className="group">
              <div
                className={cn(
                  "flex flex-col justify-between min-h-[140px] rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm",
                  "bg-gradient-to-br from-[var(--card)] to-[var(--background)]",
                  "hover:scale-105 hover:shadow-lg"
                )}
              >
                <div className="flex items-center mb-2">
                  <action.icon className="h-7 w-7 mr-2 opacity-90 text-[var(--muted)]" />
                  <span className={cn(
                    "text-lg font-semibold text-[var(--foreground)] truncate transition-all duration-200",
                    "line-clamp-2 group-hover:line-clamp-none"
                  )}>{action.title}</span>
                </div>
                <p className={cn(
                  "text-sm text-[var(--muted)] mt-2 transition-all duration-200",
                  "line-clamp-2 group-hover:line-clamp-none"
                )}>
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 