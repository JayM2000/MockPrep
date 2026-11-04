import { BrandLogo } from "@/components/shared/brand-logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { PublicHeaderActions } from "./public-header-actions"

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-background/95 sticky top-0 z-40 backdrop-blur-none">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <PublicHeaderActions />
        </div>
      </div>
    </header>
  )
}
