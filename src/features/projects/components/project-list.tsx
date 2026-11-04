"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FolderGit2, AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/services/projects/project.queries"
import { ProjectCard } from "./project-card"
import { ProjectSkeletonGrid } from "./project-skeleton"
import type { ProjectStatus, ProjectComplexity } from "@/services/projects/project.types"

export function ProjectList() {
  const searchParams = useSearchParams()

  const search = searchParams.get("search") ?? undefined
  const status = (searchParams.get("status") as ProjectStatus) ?? undefined
  const complexity = (searchParams.get("complexity") as ProjectComplexity) ?? undefined

  const { data: projects, isLoading, isError, error, refetch } = useProjects({
    search,
    status,
    complexity,
  })

  if (isLoading) {
    return <ProjectSkeletonGrid count={6} />
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto size-8 text-destructive" />
        <h3 className="mt-3 text-base font-semibold text-foreground">Failed to load projects</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An unexpected error occurred while fetching projects."}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    const isFiltered = Boolean(search || status || complexity)

    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <FolderGit2 className="mx-auto size-10 text-muted-foreground/60" />
        <h3 className="mt-4 text-base font-semibold">
          {isFiltered ? "No matching projects found" : "No projects yet"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          {isFiltered
            ? "Try adjusting your search query or removing filters to view available projects."
            : "Get started by describing a new software project or selecting a starter template."}
        </p>
        {!isFiltered && (
          <div className="mt-6">
            <Link href="/projects/new">
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                Create First Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
