"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  FolderGit2,
  Plus,
  Share2,
  Clock,
  Lock,
  Globe,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/services/projects/project.queries"
import { ProjectCard } from "@/features/projects/components/project-card"
import { useCurrentTime } from "@/hooks/use-current-time"
import type { ProjectFilters } from "@/services/projects/project.types"

const DASHBOARD_PROJECT_FILTERS: ProjectFilters = {
  sortBy: "updatedAt",
  sortOrder: "desc",
}

export function AssessorDashboard() {
  const { user } = useUser()
  const { data: projects, isLoading } = useProjects(DASHBOARD_PROJECT_FILTERS)
  const now = useCurrentTime()

  const displayName = user?.firstName || "Assessor"
  const allProjects = projects ?? []
  const totalProjects = allProjects.length

  const publicCount = allProjects.filter((p) => p.visibility === "public").length
  const privateCount = allProjects.filter((p) => p.visibility === "private").length

  // Expiring soon projects (< 3 days)
  const expiringSoonProjects = now
    ? allProjects.filter((p) => {
        const diff = Math.ceil((new Date(p.expiresAt).getTime() - now) / (1000 * 60 * 60 * 24))
        return diff > 0 && diff <= 3
      })
    : []

  const expiredProjects = now
    ? allProjects.filter((p) => {
        return new Date(p.expiresAt).getTime() <= now
      })
    : []

  const recentProjects = allProjects.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-background to-background">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
            >
              Assessor Workspace
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {displayName}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Design realistic interview projects, generate shareable links, and administer candidate evaluation sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/links">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Share2 className="size-3.5" />
              Shared Links
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button size="sm" className="gap-2 text-xs bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="size-3.5" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Expiring Soon Alert Banner */}
      {expiringSoonProjects.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-semibold text-sm">
              {expiringSoonProjects.length} {expiringSoonProjects.length === 1 ? "project is" : "projects are"} expiring within 3 days
            </p>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">
              Candidates won&apos;t be able to access expired project links. Open project settings to extend their expiry date up to 30 days.
            </p>
          </div>
          <Link href="/projects">
            <Button size="sm" variant="outline" className="text-xs h-8 border-amber-500/40 text-amber-800 dark:text-amber-200">
              Review
            </Button>
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderGit2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-8" />
            ) : (
              <div className="text-2xl font-bold">{totalProjects}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Configured codebase repositories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Public vs Private</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="size-3 text-emerald-500" />
              <Lock className="size-3" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {publicCount} <span className="text-sm font-normal text-muted-foreground">/ {privateCount}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {publicCount} listed publicly, {privateCount} private
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-8" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {expiringSoonProjects.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {expiredProjects.length} already expired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Shares</CardTitle>
            <Share2 className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-8" />
            ) : (
              <div className="text-2xl font-bold">
                {allProjects.filter((p) => p.shareToken && (!now || new Date(p.expiresAt).getTime() > now)).length}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Live candidate invite links</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your Projects</h2>
            <p className="text-xs text-muted-foreground">
              Review visibility, copy shareable tokens, or configure challenges.
            </p>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <FolderGit2 className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-semibold">No Projects Created Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
              Create your first project to configure technical challenges and invite candidates.
            </p>
            <Link href="/projects/new">
              <Button size="sm" className="gap-2 text-xs">
                <Plus className="size-3.5" />
                Create First Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} showOwnerActions={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
