import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/shared/brand-logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { SITE_CONFIG } from "@/lib/constants/site"

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-background/95 sticky top-0 z-40 backdrop-blur-none">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href={SITE_CONFIG.routes.signIn}>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href={SITE_CONFIG.routes.signUp}>
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
