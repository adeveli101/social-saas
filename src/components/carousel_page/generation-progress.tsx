import React from "react"

export function GenerationProgress({ progress }: { progress: any }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Generating your carousel...</h2>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress?.percent || 30}%` }} />
        </div>
        <div className="text-muted-foreground">{progress?.message || "Please wait while we create your content..."}</div>
      </div>
    </div>
  )
} 