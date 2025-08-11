"use client"

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  )
}



