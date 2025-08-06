'use client'

import { SignIn, SignUp } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'signin' 
            ? 'Sign in to your Social SaaS account'
            : 'Start managing your social media with Social SaaS'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'signin' ? (
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all duration-300',
                socialButtonsBlockButtonText: 'text-white font-medium',
                formFieldLabel: 'text-gray-200 font-medium',
                formFieldInput: 'bg-white/10 border border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300',
                footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium transition-colors',
                footerActionText: 'text-gray-300',
                formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white transition-colors',
                formFieldInputShowPasswordIcon: 'text-gray-400',
                formResendCodeLink: 'text-blue-400 hover:text-blue-300 font-medium transition-colors',
                identityPreviewText: 'text-gray-200',
                identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
                otpCodeFieldInput: 'bg-white/10 border border-white/20 text-white text-center text-lg font-mono focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30',
                alertText: 'text-red-300',
                alert: 'bg-red-500/20 border border-red-400/30 backdrop-blur-sm',
                alertIcon: 'text-red-400',
                dividerLine: 'bg-white/20',
                dividerText: 'text-gray-300',
                formFieldErrorText: 'text-red-300 text-sm',
                formFieldError: 'border-red-400/50',
                loading: 'text-blue-400',
                spinner: 'text-blue-400',
              }
            }}
          />
        ) : (
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all duration-300',
                socialButtonsBlockButtonText: 'text-white font-medium',
                formFieldLabel: 'text-gray-200 font-medium',
                formFieldInput: 'bg-white/10 border border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300',
                footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium transition-colors',
                footerActionText: 'text-gray-300',
                formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white transition-colors',
                formFieldInputShowPasswordIcon: 'text-gray-400',
                formResendCodeLink: 'text-blue-400 hover:text-blue-300 font-medium transition-colors',
                identityPreviewText: 'text-gray-200',
                identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
                otpCodeFieldInput: 'bg-white/10 border border-white/20 text-white text-center text-lg font-mono focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30',
                alertText: 'text-red-300',
                alert: 'bg-red-500/20 border border-red-400/30 backdrop-blur-sm',
                alertIcon: 'text-red-400',
                dividerLine: 'bg-white/20',
                dividerText: 'text-gray-300',
                formFieldErrorText: 'text-red-300 text-sm',
                formFieldError: 'border-red-400/50',
                loading: 'text-blue-400',
                spinner: 'text-blue-400',
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  )
} 