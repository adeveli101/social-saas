'use client'

import { useEffect, useState } from 'react'

export function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState<{
    supabaseUrl: string
    supabaseKey: string
    clerkKey: string
    nodeEnv: string
    timestamp: string
  }>({
    supabaseUrl: '',
    supabaseKey: '',
    clerkKey: '',
    nodeEnv: '',
    timestamp: ''
  })

  useEffect(() => {
    const info = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      clerkKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SET' : 'NOT_SET',
      nodeEnv: process.env.NODE_ENV || 'NOT_SET',
      timestamp: new Date().toISOString()
    }
    setDebugInfo(info)
  }, [])

  // Sadece development'ta göster
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <div>Supabase URL: {debugInfo.supabaseUrl.substring(0, 30)}...</div>
        <div>Supabase Key: {debugInfo.supabaseKey}</div>
        <div>Clerk Key: {debugInfo.clerkKey}</div>
        <div>Node Env: {debugInfo.nodeEnv}</div>
        <div>Time: {debugInfo.timestamp}</div>
      </div>
    </div>
  )
} 