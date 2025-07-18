'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Bot, FolderOpen, Sparkles } from "lucide-react"
import Link from 'next/link'
import { cn } from "@/lib/utils"

const primaryActions = [
  {
    title: "Create AI Carousel",
    description: "Generate engaging carousels with AI-powered content creation",
    icon: Bot,
    href: "/carousel",
    cta: "Start Creating",
    bgClass: "bg-gradient-to-br from-blue-500/20 to-purple-600/20 dark:from-blue-500/10 dark:to-purple-600/10",
    borderClass: "border-blue-200 dark:border-blue-800"
  },
  {
    title: "Content Board",
    description: "Organize and manage your AI-generated carousels in Kanban board",
    icon: LayoutGrid,
    href: "/content-board",
    cta: "View Board",
    bgClass: "bg-gradient-to-br from-green-500/20 to-teal-600/20 dark:from-green-500/10 dark:to-teal-600/10",
    borderClass: "border-green-200 dark:border-green-800"
  },
]

const quickLinks = [
  {
    title: "Recent Carousels",
    description: "Quick access to your latest creations",
    icon: FolderOpen,
    href: "/content-board",
    cta: "Browse"
  },
  {
    title: "Carousel Templates",
    description: "Use pre-built templates for faster creation",
    icon: Sparkles,
    href: "/carousel",
    cta: "Explore"
  },
]

export function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Primary Actions - Compact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {primaryActions.map((action, index) => (
          <div
            key={index}
            className="animate-in fade-in-0 duration-500"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Link href={action.href} className="group block">
              <Card className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full",
                "bg-glass backdrop-blur-sm border-white/10 hover:border-white/20",
                action.bgClass
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                        <action.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-50 group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-200 mb-4 flex-1">
                      {action.description}
                    </p>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-100 hover:text-white border-white/20"
                      variant="outline"
                    >
                      {action.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <Card className="bg-glass backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-gray-50">
            Quick Links
          </CardTitle>
          <CardDescription className="text-gray-200">
            Shortcuts to frequently used features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="animate-in fade-in-0 duration-500"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <Link href={link.href} className="block">
                  <div className="p-4 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10 hover:border-blue-400/30 cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <link.icon className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <h3 className="font-medium text-sm text-gray-50">{link.title}</h3>
                    </div>
                    <p className="text-xs text-gray-200 mb-3">{link.description}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-3 text-xs w-full group-hover:bg-blue-400/10 text-gray-100 hover:text-white"
                    >
                      {link.cta}
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 