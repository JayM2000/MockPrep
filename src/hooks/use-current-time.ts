"use client"

import * as React from "react"

let currentTimestamp: number = typeof window !== "undefined" ? Date.now() : 0
const listeners = new Set<() => void>()

if (typeof window !== "undefined") {
  // Update timestamp every 15 seconds with referential stability between ticks
  setInterval(() => {
    currentTimestamp = Date.now()
    listeners.forEach((listener) => listener())
  }, 15000)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): number {
  return currentTimestamp
}

function getServerSnapshot(): null {
  return null
}

/**
 * Returns current timestamp in milliseconds using a stable external store.
 * - During SSR/prerender: returns null to satisfy Next.js 16 partial prefetching.
 * - On client: returns a stable timestamp that only changes periodically (every 15s),
 *   preventing infinite re-render loops in React.
 */
export function useCurrentTime(): number | null {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
