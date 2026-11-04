import { SITE_CONFIG } from "@/lib/constants/site"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-sm text-muted-foreground">
        <p>© {SITE_CONFIG.copyrightYear} {SITE_CONFIG.name}. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="text-xs">Themes: Light / Dark / Purple</span>
        </div>
      </div>
    </footer>
  )
}
