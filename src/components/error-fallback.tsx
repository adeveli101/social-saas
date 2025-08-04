'use client'

import { useEffect, useState } from 'react'

export function ErrorFallback({ error }: { error: Error }) {
  const [errorDetails, setErrorDetails] = useState({
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    console.error('Error caught by fallback:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Application Error
          </h3>
          
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Error Details:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div><strong>Type:</strong> {errorDetails.name}</div>
              <div><strong>Message:</strong> {errorDetails.message}</div>
              <div><strong>Time:</strong> {errorDetails.timestamp}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p>This error has been logged. Please try refreshing the page or contact support if the problem persists.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 