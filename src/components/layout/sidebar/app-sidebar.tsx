import { Suspense } from "react"
import { BrandLogo } from "@/components/shared/brand-logo"
import { SidebarNav } from "./sidebar-nav"

export function AppSidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <BrandLogo href="/dashboard" />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
          <SidebarNav />
        </Suspense>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Engine v1.0</span>
          <span className="inline-block size-2 rounded-full bg-emerald-500" title="System Operational" />
        </div>
      </div>
    </aside>
  )
}
