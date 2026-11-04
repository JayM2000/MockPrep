import { Suspense } from "react"
import { MobileSidebar } from "../sidebar/mobile-sidebar"
import { Breadcrumbs } from "./breadcrumbs"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export function AppHeader() {
  return (
    <header className="h-14 border-b border-border bg-background/95 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar />
        <Suspense fallback={<div className="h-4 w-24 bg-muted/20 rounded" />}>
          <Breadcrumbs />
        </Suspense>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
