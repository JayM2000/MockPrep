"use client"

import {
  CANDIDATE_NAV_ITEMS,
  ASSESSOR_NAV_ITEMS,
  DASHBOARD_NAV_ITEMS,
} from "@/config/navigation"
import { useUserRole } from "@/context/user-role-context"
import { SidebarItem } from "./sidebar-item"

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { role, isLoading } = useUserRole()

  const navItems = isLoading
    ? DASHBOARD_NAV_ITEMS
    : role === "assessor"
    ? ASSESSOR_NAV_ITEMS
    : role === "candidate"
    ? CANDIDATE_NAV_ITEMS
    : DASHBOARD_NAV_ITEMS

  return (
    <nav className="flex flex-col gap-1 px-2" aria-label="Main Navigation">
      {navItems.map((item) => (
        <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}
