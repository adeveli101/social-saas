import { UserProfileSection } from "@/components/dashboard_page/user-profile-section"
import { StatsGrid } from "@/components/dashboard_page/stats-grid"
import { RecentCreations } from "@/components/dashboard_page/recent-creations"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="border-b border-white/10 bg-glass backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50">AI Carousel Studio</h1>
              <p className="text-gray-200 mt-1">Your creative hub for AI-powered carousel generation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* User Profile Section with Tabs */}
          <UserProfileSection />
          
          {/* Stats Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-50">Creation Overview</h2>
            <StatsGrid />
          </div>

          {/* Recent Activity Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-50">Recent Activity</h2>
            <RecentCreations />
          </div>
        </div>
      </main>
    </div>
  )
} 