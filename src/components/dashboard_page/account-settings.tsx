'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { 
  User, 
  Shield, 
  CreditCard, 
  Settings,
  Crown,
  Sparkles
} from 'lucide-react'

export function AccountSettings() {
  const { user, isLoaded } = useUser()

  const getUserPlan = () => {
    if (!user) return 'free'
    return (user.publicMetadata?.plan as string) || 'free'
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'Pro'
      case 'premium':
        return 'Premium'
      default:
        return 'Free'
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
      case 'premium':
        return <Crown className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none'
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none'
      default:
        return 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'
    }
  }

  const accountActions = [
    {
      title: "Profile",
      description: "Manage your profile",
      icon: User,
      bgClass: "bg-gradient-to-br from-blue-500/20 to-cyan-600/20"
    },
    {
      title: "Security",
      description: "Account security settings",
      icon: Shield,
      bgClass: "bg-gradient-to-br from-green-500/20 to-emerald-600/20"
    },
    {
      title: "Billing",
      description: "Manage subscription",
      icon: CreditCard,
      bgClass: "bg-gradient-to-br from-purple-500/20 to-pink-600/20"
    },
    {
      title: "Settings",
      description: "Account preferences",
      icon: Settings,
      bgClass: "bg-gradient-to-br from-orange-500/20 to-red-600/20"
    }
  ]

  if (!isLoaded) {
    return (
      <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-white/20 rounded w-32"></div>
              <div className="h-6 bg-white/20 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const userPlan = getUserPlan()

  return (
    <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-50">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-300">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={getPlanBadgeClass(userPlan)}
            >
              {getPlanIcon(userPlan)}
              <span className="ml-1">{getPlanDisplayName(userPlan)}</span>
            </Badge>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 ring-2 ring-white/20 shadow-lg rounded-full",
                }
              }}
              userProfileMode="modal"
              userProfileProps={{
                appearance: {
                  elements: {
                    modalBackdrop: "bg-black/60 backdrop-blur-md animate-in fade-in duration-300 fixed inset-0 z-[9999]",
                    modalContent: "bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl animate-in slide-in-from-bottom-4 duration-300 fixed bottom-0 left-0 right-0 z-[10000] max-h-[90vh] overflow-y-auto rounded-t-xl",
                    modalCard: "bg-transparent border-none shadow-none",
                    modalHeader: "border-white/10 pb-4",
                    modalHeaderTitle: "text-white font-bold text-xl tracking-tight",
                    modalHeaderSubtitle: "text-gray-300 text-sm leading-relaxed",
                    modalBody: "text-gray-200 space-y-6",
                    modalFooter: "border-white/10 pt-4",
                    
                    pageScrollBox: "bg-transparent max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
                    navbar: "border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-2 sticky top-0 z-10",
                    navbarButton: "text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg px-3 py-2 font-medium",
                    navbarButtonActive: "text-white bg-white/15 font-semibold",
                    
                    profileSection: "border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-4",
                    profileSectionTitle: "text-white font-bold text-lg",
                    profileSectionContent: "text-gray-200 space-y-3",
                    
                    formField: "space-y-3",
                    formFieldLabel: "text-gray-200 font-semibold text-sm tracking-wide",
                    formFieldInput: "bg-white/8 border border-white/15 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 text-base",
                    formFieldError: "text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2",
                    
                    formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
                    formButtonSecondary: "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20 font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:border-white/30",
                    
                    dangerZone: "border-red-500/30 bg-red-500/10 backdrop-blur-sm rounded-lg p-4 space-y-3",
                    dangerZoneTitle: "text-red-400 font-bold text-lg",
                    dangerZoneDescription: "text-gray-300 text-sm leading-relaxed",
                    dangerZoneButton: "bg-red-500 hover:bg-red-600 text-white border-none font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Account Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {accountActions.map((action, index) => (
            <div
              key={index}
              className="animate-in fade-in-0 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <action.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm text-gray-50 group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h5>
                  </div>
                </div>
                <p className="text-xs text-gray-300 mb-3">
                  {action.description}
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-100 hover:text-white border-white/20"
                  onClick={() => {
                    // Trigger Clerk's user profile modal
                    const userButton = document.querySelector('[data-clerk-user-button]') as HTMLElement
                    if (userButton) {
                      userButton.click()
                    }
                  }}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 