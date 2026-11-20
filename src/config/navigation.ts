import {
  LayoutDashboard,
  FolderGit2,
  PlaySquare,
  Settings,
  BarChart3,
  Compass,
  Bookmark,
  PlusCircle,
  Share2,
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

/**
 * Navigation for Candidates (Users preparing for technical interviews)
 */
export const CANDIDATE_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: PlaySquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

/**
 * Navigation for Assessors (Creators designing projects and evaluations)
 */
export const ASSESSOR_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Projects",
    href: "/projects",
    icon: FolderGit2,
  },
  {
    title: "Create Project",
    href: "/projects/new",
    icon: PlusCircle,
  },
  {
    title: "Shared Links",
    href: "/links",
    icon: Share2,
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: PlaySquare,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

/**
 * Fallback items before role is resolved
 */
export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: PlaySquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]
