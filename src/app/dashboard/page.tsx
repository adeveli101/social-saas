import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Header } from "@/components/shared/header"
import { WelcomeSection } from "@/components/dashboard_page/welcome-section"
import { StatsGrid } from "@/components/dashboard_page/stats-grid"
import { ActivitySection } from "@/components/dashboard_page/activity-section"
import { QuickActions } from "@/components/dashboard_page/quick-actions"
import { ConnectedAccounts } from "@/components/dashboard_page/connected-accounts"
import { PaywallGuard } from "@/components/paywall/paywall-guard"
import { PageContainer } from "@/components/shared/page-container"

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <PageContainer>
      <Header />
      <main className="w-full max-w-screen-2xl px-6 md:px-12 mx-auto py-8">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </main>
    </PageContainer>
  )
} 