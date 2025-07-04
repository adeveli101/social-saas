import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from './plans'

// Clerk konfigürasyonu
export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
}

// Re-export types for convenience
export type { SubscriptionPlan, UserSubscription } from './plans'
export { SUBSCRIPTION_PLANS } from './plans'

// Auth yardımcı fonksiyonları
export async function getCurrentUser(supabase: any) {
  const { userId } = await auth()
  if (!userId) return null
  
  const clerkUser = await clerkClient.users.getUser(userId)
  
  // Supabase'de kullanıcıyı oluştur veya al
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (!existingUser) {
    // Yeni kullanıcı oluştur
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        plan: 'free'
      })
      .select()
      .single()
    
    return {
      clerk: clerkUser,
      supabase: newUser
    }
  }
  
  return {
    clerk: clerkUser,
    supabase: existingUser
  }
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Authentication required')
  }
  return userId
}

// Paywall yardımcı fonksiyonları
export async function hasActiveSubscription(userId: string, supabase: any): Promise<boolean> {
  const plan = await getUserCurrentPlan(userId, supabase)
  return plan !== 'free'
}

export async function canAccessFeature(
  feature: string,
  userId: string,
  supabase: any,
  requiredPlan?: string
): Promise<boolean> {
  const currentPlan = await getUserCurrentPlan(userId, supabase)
  
  if (!currentPlan) return false
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === requiredPlan || currentPlan)
  if (!plan) return false
  
  // Free plan kısıtlamaları
  if (plan.id === 'free') {
    const freePlanLimits: Record<string, number> = {
      'social_accounts': 3,
      'scheduled_posts': 5,
      'analytics': 1,
    }
    
    // Burada kullanıcının mevcut kullanımını kontrol edebilirsiniz
    // Şimdilik basit bir kontrol yapıyoruz
    return true
  }
  
  return true
}

// Plan yönetimi
export async function upgradeUserPlan(userId: string, planId: string, supabase: any) {
  try {
    // Supabase'de planı güncelle
    await supabase
      .from('users')
      .update({ plan: planId })
      .eq('clerk_id', userId)
    
    // Clerk'te metadata'yı güncelle
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { plan: planId }
    })
    
    return true
  } catch (error) {
    console.error('Error upgrading user plan:', error)
    return false
  }
}

export async function getUserCurrentPlan(userId: string, supabase: any): Promise<string> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('clerk_id', userId)
      .single()
    
    return user?.plan || 'free'
  } catch (error) {
    console.error('Error getting user plan:', error)
    return 'free'
  }
} 