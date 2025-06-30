import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Settings, ExternalLink } from "lucide-react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function ConnectedAccounts({ userId }: { userId: string }) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  let accounts = []
  if (userId) {
    const { data } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId)
    accounts = data || []
  }

  return (
    <Card className="bg-surface-primary border-surface-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-text-primary">Connected Accounts</CardTitle>
          <CardDescription className="text-text-secondary">
            Manage your social media platform connections
          </CardDescription>
        </div>
        <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.length === 0 && (
            <div className="text-center text-text-tertiary py-8">No connected accounts found.</div>
          )}
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-lg border border-surface-border hover:border-primary-600/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={account.avatar} alt={account.platform} />
                  <AvatarFallback className={account.color}>
                    {account.platform?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-text-primary">{account.platform}</h3>
                    <Badge 
                      variant={account.status === "connected" ? "default" : "secondary"}
                      className={account.status === "connected" 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-surface-secondary text-text-tertiary border-surface-border"
                      }
                    >
                      {account.status === "connected" ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary">{account.username}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-text-tertiary">{account.followers} followers</span>
                    <span className="text-xs text-text-tertiary">{account.posts} posts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {account.status === "connected" ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-text-tertiary hover:text-text-primary hover:bg-surface-secondary">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-text-tertiary hover:text-text-primary hover:bg-surface-secondary">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 