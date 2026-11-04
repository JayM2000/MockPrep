"use client"

import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProject } from "@/services/projects/project.queries"
import { ProjectStatusBadge } from "@/features/projects/components/project-status-badge"
import { ProjectOverviewTab } from "@/features/projects/components/project-overview-tab"
import { ProjectConfigTab } from "@/features/projects/components/project-config-tab"
import { ProjectChallengesTab } from "@/features/projects/components/project-challenges-tab"
import { ProjectSessionsTab } from "@/features/projects/components/project-sessions-tab"

interface ProjectDetailViewProps {
  projectId: string
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/projects">
              <Button variant="ghost" size="icon-sm" aria-label="Back to projects">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="text-sm text-muted-foreground pl-9">{project.category} · {project.complexity}</p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProjectOverviewTab project={project} />
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          <ProjectConfigTab project={project} />
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <ProjectChallengesTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <ProjectSessionsTab projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
