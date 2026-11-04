import { Suspense } from "react"
import { BrandLogo } from "@/components/shared/brand-logo"
import { SidebarNav } from "./sidebar-nav"
import { SidebarFooter } from "./sidebar-footer"

export function AppSidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen h-dvh sticky top-0 border-r border-border bg-sidebar text-sidebar-foreground">
      {/* Pinned Brand Header */}
      <div className="flex h-14 shrink-0 items-center px-4 border-b border-sidebar-border">
        <BrandLogo href="/dashboard" />
      </div>

      {/* Independently Scrollable Navigation Container */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4">
        <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
          <SidebarNav />
        </Suspense>
      </div>

      {/* Pinned Engine Info Footer (Always at bottom) */}
      <SidebarFooter />
    </aside>
  )
}
