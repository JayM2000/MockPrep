"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/^\[.*\]$/, (m) => m.slice(1, -1))
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumbs" className="flex items-center text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Dashboard Home"
      >
        <Home className="size-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`
        const isLast = index === segments.length - 1
        const formatted = formatSegment(segment)

        return (
          <React.Fragment key={href}>
            <ChevronRight className="size-3.5 mx-1.5 text-muted-foreground/50 shrink-0" />
            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]" aria-current="page">
                {formatted}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[150px]"
              >
                {formatted}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
