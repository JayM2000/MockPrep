"use client"

import Link from "next/link"
import { Plus, ArrowRight, FolderGit2, PlaySquare, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/services/projects/project.queries"
import { ProjectCard } from "@/features/projects/components/project-card"

export default function DashboardPage() {
  const { data: projects, isLoading } = useProjects({ sortBy: "updatedAt", sortOrder: "desc" })

  const recentProjects = projects?.slice(0, 3) ?? []
  const totalProjects = projects?.length ?? 0
  const readyProjects = projects?.filter((p) => p.status === "ready").length ?? 0

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Manage projects, active interview sessions, and participant environments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/join">
            <Button variant="outline" size="sm" className="gap-2">
              <Key className="size-4" />
              Join Session
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

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
            <p className="text-xs text-muted-foreground mt-1">{readyProjects} ready for challenges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <PlaySquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running environments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-normal">Mock</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Evaluation reports retained</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Environment Quota</CardTitle>
            <span className="text-xs text-muted-foreground font-mono">0 / 5</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">Ephemeral container usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
              <CardDescription>Software projects configured for assessments</CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="border-t border-border pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No projects created yet. Start by generating or importing your first project.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active / Recent Sessions Placeholder */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Active & Upcoming Sessions</CardTitle>
              <CardDescription>Live candidate interviews and simulation sessions</CardDescription>
            </div>
            <Link href="/sessions">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="py-8 text-center text-sm text-muted-foreground border-t border-border">
            No active sessions. Start a session from any approved challenge.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
