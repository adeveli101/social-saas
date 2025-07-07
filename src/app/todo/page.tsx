import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Header } from "@/components/shared/header"
import { TodoList } from "@/components/todo_page/todo-list"
import { TodoForm } from "@/components/todo_page/todo-form"
import { TodoStats } from "@/components/todo_page/todo-stats"
import { PaywallGuard } from "@/components/paywall/paywall-guard"
import { PageContainer } from "@/components/shared/page-container"

export default async function TodoPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <PageContainer>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Todo Management</h1>
            <p className="text-muted-foreground">Organize your tasks and track your progress</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PaywallGuard feature="Todo Management" requiredPlan="free">
                <TodoForm userId={userId} />
                <TodoList userId={userId} />
              </PaywallGuard>
            </div>
            <div>
              <TodoStats userId={userId} />
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  )
} 