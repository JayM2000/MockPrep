"use client"

import { useSocket } from "@/context/socket-context"

export function SidebarFooter() {
  const { isConnected } = useSocket()

  return (
    <div className="shrink-0 mt-auto p-4 border-t border-sidebar-border text-xs text-muted-foreground bg-sidebar">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={`inline-block size-2 rounded-full transition-colors ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
            title={isConnected ? "Real-time sync connected" : "Connecting to real-time gateway..."}
          />
          <span className="text-[11px] text-foreground/80">
            {isConnected ? "Live Sync Active" : "Connecting..."}
          </span>
        </span>
        <span className="text-[10px] text-muted-foreground/60">Engine v1.0</span>
      </div>
    </div>
  )
}
