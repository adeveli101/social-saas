import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap, Crown } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WelcomeSectionProps {
  plan: string
}

// Plan badge renkleri
const getPlanBadgeClass = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'free':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pro':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'business':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};

const getPlanTextClass = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'free':
      return 'text-green-700';
    case 'pro':
      return 'text-blue-700';
    default:
      return 'text-primary';
  }
};

const getPlanIcon = (plan: string, className = "") => {
  switch (plan.toLowerCase()) {
    case 'free':
      return <Zap className={className} />;
    case 'pro':
      return <Crown className={className} />;
    default:
      return <Crown className={className} />;
  }
};

export function WelcomeSection({ plan }: WelcomeSectionProps) {
  const currentDate = new Date()
  const currentTime = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  const currentDay = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  // Plan adını düzgün göster
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

  return (
    <Card className="mb-8 bg-gradient-to-r from-[var(--card)] to-[var(--background)] border-[var(--primary)]/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground mb-4">
              Here's what's happening with your social media accounts today.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{currentDay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/pricing" tabIndex={0} aria-label="View or change your subscription plan">
                    <Badge 
                      variant="secondary" 
                      className={`bg-[var(--card)] border border-[var(--border)] ${getPlanTextClass(plan)} cursor-pointer hover:opacity-90 transition-colors`}
                    >
                      <span className="flex items-center gap-1">
                        {getPlanIcon(plan, `h-4 w-4 ${getPlanTextClass(plan)}`)}
                        {planLabel}
                      </span>
                    </Badge>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  View or change your subscription plan
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">Social SaaS</div>
              <div className="text-sm text-muted-foreground">Management Platform</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 