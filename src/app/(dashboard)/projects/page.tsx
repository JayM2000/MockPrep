"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectList } from "@/features/projects/components/project-list"
import { ProjectFiltersBar } from "@/features/projects/components/project-filters"
import { ProjectSkeletonGrid } from "@/features/projects/components/project-skeleton"
import { useUserRole } from "@/context/user-role-context"

export default function ProjectsPage() {
  const { isAssessor } = useUserRole()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {isAssessor
              ? "Manage your codebases, expiration windows, and candidate access links."
              : "Explore and prepare for engineering interview challenges."}
          </p>
        </div>
        {isAssessor && (
          <Link href="/projects/new">
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              New Project
            </Button>
          </Link>
        )}
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
