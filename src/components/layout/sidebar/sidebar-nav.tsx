"use client"

import { DASHBOARD_NAV_ITEMS } from "@/config/navigation"
import { SidebarItem } from "./sidebar-item"

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 px-2" aria-label="Main Navigation">
      {DASHBOARD_NAV_ITEMS.map((item) => (
        <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}
