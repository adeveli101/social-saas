import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard_page/header"
import { WelcomeSection } from "@/components/dashboard_page/welcome-section"
import { StatsGrid } from "@/components/dashboard_page/stats-grid"
import { ActivitySection } from "@/components/dashboard_page/activity-section"
import { QuickActions } from "@/components/dashboard_page/quick-actions"
import { ConnectedAccounts } from "@/components/dashboard_page/connected-accounts"
import { PaywallGuard } from "@/components/paywall/paywall-guard"

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection />
        <StatsGrid userId={userId} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ActivitySection userId={userId} />
          <PaywallGuard feature="Advanced Analytics" requiredPlan="pro">
            <QuickActions />
          </PaywallGuard>
        </div>
        <div className="mt-8">
          <PaywallGuard feature="Multiple Social Accounts" requiredPlan="pro">
            <ConnectedAccounts userId={userId} />
          </PaywallGuard>
        </div>
      </main>
    </div>
  )
} 