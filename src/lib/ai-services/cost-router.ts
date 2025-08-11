// =============================================================================
// Cost-Aware Provider Router (Lightweight)
// =============================================================================
// Reads static/env-provided cost hints and returns a provider order for routing.
// Extend with live telemetry later.

import type { AIServiceProvider } from './types'

export interface ProviderCostHint {
  provider: AIServiceProvider
  imageStd?: number // $/image
  imageHd?: number // $/image
  textPer1k?: number // $/1K tok
}

export function getProviderOrderByCost(
  providers: AIServiceProvider[],
  hints: ProviderCostHint[]
): AIServiceProvider[] {
  const map = new Map(hints.map(h => [h.provider, h]))
  return [...providers].sort((a, b) => {
    const ca = map.get(a)?.imageStd ?? Number.POSITIVE_INFINITY
    const cb = map.get(b)?.imageStd ?? Number.POSITIVE_INFINITY
    return ca - cb
  })
}



