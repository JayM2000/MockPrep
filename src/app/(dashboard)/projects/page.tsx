"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectList } from "@/features/projects/components/project-list"
import { ProjectFiltersBar } from "@/features/projects/components/project-filters"
import { ProjectSkeletonGrid } from "@/features/projects/components/project-skeleton"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Explore, create, and manage software projects for engineering challenges.
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="h-9 w-full bg-muted/20 rounded" />}>
        <ProjectFiltersBar />
      </Suspense>

      <Suspense fallback={<ProjectSkeletonGrid count={6} />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
