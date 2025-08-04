'use client'

import { useEffect, useState } from 'react'

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    supabase: boolean
    clerk: boolean
  }>({
    supabase: false,
    clerk: false
  })

  useEffect(() => {
    const checkEnv = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

      console.log('Environment Check:', {
        supabaseUrl: supabaseUrl ? 'SET' : 'NOT_SET',
        supabaseKey: supabaseKey ? 'SET' : 'NOT_SET',
        clerkKey: clerkKey ? 'SET' : 'NOT_SET',
        nodeEnv: process.env.NODE_ENV
      })

      setEnvStatus({
        supabase: !!(supabaseUrl && supabaseKey),
        clerk: !!clerkKey
      })
    }

    checkEnv()
  }, [])

  if (!envStatus.supabase || !envStatus.clerk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Configuration Required
            </h3>
            <div className="text-sm text-gray-500 mb-4 space-y-2">
              {!envStatus.supabase && (
                <p>• Supabase environment variables are missing</p>
              )}
              {!envStatus.clerk && (
                <p>• Clerk environment variables are missing</p>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Please configure the required environment variables in your deployment platform.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
} 