"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Compass, Bookmark, Key, PlaySquare, ArrowRight, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects, useBookmarks } from "@/services/projects/project.queries"
import { ProjectCard } from "@/features/projects/components/project-card"
import type { ProjectFilters } from "@/services/projects/project.types"

const CANDIDATE_DASHBOARD_FILTERS: ProjectFilters = {
  sortBy: "updatedAt",
  sortOrder: "desc",
}

export function CandidateDashboard() {
  const { user } = useUser()
  const { data: projects, isLoading: isProjectsLoading } = useProjects(CANDIDATE_DASHBOARD_FILTERS)
  const { data: bookmarks, isLoading: isBookmarksLoading } = useBookmarks()

  const displayName = user?.firstName || "Candidate"
  const totalAvailable = projects?.length ?? 0
  const totalBookmarks = bookmarks?.length ?? 0
  const recentProjects = projects?.slice(0, 4) ?? []

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-background to-background">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Candidate Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Explore curated open-source architectures, practice technical interview challenges, and master system design.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/join">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Key className="size-3.5" />
              Join with Code
            </Button>
          </Link>
          <Link href="/discover">
            <Button size="sm" className="gap-2 text-xs">
              <Compass className="size-3.5" />
              Discover Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Public Projects</CardTitle>
            <Compass className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isProjectsLoading ? (
              <Skeleton className="h-7 w-8" />
            ) : (
              <div className="text-2xl font-bold">{totalAvailable}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Available for hands-on practice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
            <Bookmark className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isBookmarksLoading ? (
              <Skeleton className="h-7 w-8" />
            ) : (
              <div className="text-2xl font-bold">{totalBookmarks}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Saved for upcoming preparation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Interview Sessions</CardTitle>
            <PlaySquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Simulations attempted</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Featured Engineering Challenges</h2>
            <p className="text-xs text-muted-foreground">
              Select a project to inspect architecture, debug issues, and practice.
            </p>
          </div>
          <Link href="/discover">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Browse All <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>

        {isProjectsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Code2 className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-semibold">No Public Projects Available</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Assessors have not published public projects yet, or existing projects have expired.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} showOwnerActions={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
