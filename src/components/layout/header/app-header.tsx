import { Suspense } from "react"
import { MobileSidebar } from "../sidebar/mobile-sidebar"
import { Breadcrumbs } from "./breadcrumbs"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { RoleSwitcher } from "@/components/shared/role-switcher"

export function AppHeader() {
  return (
    <header className="h-14 shrink-0 border-b border-border bg-background/95 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <MobileSidebar />
        <div className="hidden md:flex items-center">
          <Suspense fallback={<div className="h-4 w-24 bg-muted/20 rounded" />}>
            <Breadcrumbs />
          </Suspense>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <RoleSwitcher variant="header" />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
