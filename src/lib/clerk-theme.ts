// Central Clerk appearance exports to keep imports consistent across the app
// We reuse the single appearance object until a need arises to diverge them.

import { clerkAppearance } from '@/lib/clerk-client'

// Backwards-compatible export for SignIn/SignUp pages
export const clerkTheme = clerkAppearance

// Appearance used by <UserButton /> components
export const userButtonTheme = clerkAppearance

// Appearance used by <UserProfile /> in modal contexts
export const modalUserProfileTheme = clerkAppearance

export type ClerkAppearance = typeof clerkAppearance



