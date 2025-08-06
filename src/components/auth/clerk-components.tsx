'use client'

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { clerkAppearance } from "@/lib/clerk-client"

// Pre-configured SignInButton with centralized appearance
export function StyledSignInButton({ 
  children, 
  mode = "modal" as const,
  ...props 
}: React.ComponentProps<typeof SignInButton>) {
  return (
    <SignInButton 
      mode={mode} 
      appearance={clerkAppearance}
      {...props}
    >
      {children}
    </SignInButton>
  )
}

// Pre-configured SignUpButton with centralized appearance
export function StyledSignUpButton({ 
  children, 
  mode = "modal" as const,
  ...props 
}: React.ComponentProps<typeof SignUpButton>) {
  return (
    <SignUpButton 
      mode={mode} 
      appearance={clerkAppearance}
      {...props}
    >
      {children}
    </SignUpButton>
  )
}

// Pre-configured UserButton with centralized appearance
export function StyledUserButton(props: React.ComponentProps<typeof UserButton>) {
  return (
    <UserButton 
      appearance={clerkAppearance}
      {...props}
    />
  )
}

// Export the appearance configuration for direct use if needed
export { clerkAppearance } 