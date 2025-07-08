import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Settings, ExternalLink } from "lucide-react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function ConnectedAccounts({ userId }: { userId: string }) {
  const cookieStore = cookies()
  const supabase = await createClient()

  let accounts = []
  if (userId) {
    const { data } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId)
    accounts = data || []
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Connected Accounts</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your social media platform connections
          </CardDescription>
        </div>
        <Button variant="default" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <div className="flex flex-col items-center gap-2">
                <Settings className="h-8 w-8 text-muted-foreground/50" />
                <p>No connected accounts found.</p>
                <p className="text-xs">Connect your social media accounts to get started.</p>
              </div>
            </div>
          )}
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={account.avatar} alt={account.platform} />
                  <AvatarFallback className={`${account.color} text-white`}>
                    {account.platform?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-foreground">{account.platform}</h3>
                    <Badge 
                      variant={account.status === "connected" ? "default" : "secondary"}
                      className={account.status === "connected" 
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]" 
                        : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]"
                      }
                    >
                      {account.status === "connected" ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{account.username}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">{account.followers} followers</span>
                    <span className="text-xs text-muted-foreground">{account.posts} posts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {account.status === "connected" ? (
                  <>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button variant="default" size="sm">
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