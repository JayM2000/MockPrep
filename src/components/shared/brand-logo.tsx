import * as React from "react"
import Link from "next/link"
import { Terminal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SITE_CONFIG } from "@/lib/constants/site"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  showBadge?: boolean
  href?: string
}

export function BrandLogo({
  className,
  showBadge = true,
  href = SITE_CONFIG.routes.home,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 select-none", className)}
    >
      <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Terminal className="size-4" />
      </div>
      <span className="font-semibold text-base tracking-tight text-foreground">
        {SITE_CONFIG.name}
      </span>
      {showBadge && (
        <Badge variant="secondary" className="text-xs font-normal">
          Preview
        </Badge>
      )}
    </Link>
  )
}
