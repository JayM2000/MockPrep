/**
 * Reusable hook to detect when a component has mounted on the client.
 * Uses `useSyncExternalStore` for React 19 compliance without triggering cascading re-renders.
 */
import * as React from "react"

const emptySubscribe = () => () => {}

export function useIsMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
