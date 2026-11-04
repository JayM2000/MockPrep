import {
  LayoutDashboard,
  FolderGit2,
  PlaySquare,
  Settings,
  Sparkles,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
  isExternal?: boolean
  disabled?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderGit2,
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: PlaySquare,
  },
  {
    title: "Practice",
    href: "/practice",
    icon: Sparkles,
    badge: "Soon",
    disabled: true,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    badge: "Soon",
    disabled: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]
