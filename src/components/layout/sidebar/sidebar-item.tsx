"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/config/navigation"

interface SidebarItemProps {
  item: NavItem
  onNavigate?: () => void
}

export function SidebarItem({ item, onNavigate }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href))

  const Icon = item.icon

  if (item.disabled) {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed select-none"
        )}
        aria-disabled="true"
      >
        <div className="flex items-center gap-3">
          <Icon className="size-4 shrink-0" />
          <span>{item.title}</span>
        </div>
        {item.badge && (
          <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal text-muted-foreground">
            {item.badge}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors select-none",
        isActive
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4 shrink-0" />
        <span>{item.title}</span>
      </div>
      {item.badge && (
        <Badge
          variant={isActive ? "secondary" : "outline"}
          className="text-[10px] py-0 px-1 font-normal"
        >
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}
