"use client"

import * as React from "react"
import { Compass, Search, Filter, Code2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/services/projects/project.queries"
import { ProjectCard } from "@/features/projects/components/project-card"
import type { ProjectComplexity } from "@/services/projects/project.types"

export default function DiscoverPage() {
  const [search, setSearch] = React.useState("")
  const [complexity, setComplexity] = React.useState<ProjectComplexity | "all">("all")

  const { data: projects, isLoading } = useProjects({
    search: search.trim() || undefined,
    complexity: complexity === "all" ? undefined : complexity,
    sortBy: "updatedAt",
    sortOrder: "desc",
  })

  // Candidates on the backend only receive public & non-expired projects
  const publicProjects = projects?.filter((p) => p.visibility === "public") ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Compass className="size-6 text-primary" />
          Discover Projects
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore public production-ready codebases and technical challenges configured by assessors.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name, description, or tag..."
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value as ProjectComplexity | "all")}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : publicProjects.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Code2 className="mx-auto size-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold">No Public Projects Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {search
              ? "No public projects matched your search criteria. Try a different search term or difficulty filter."
              : "No public projects have been created yet, or they have expired."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {publicProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showOwnerActions={false} />
          ))}
        </div>
      )}
    </div>
  )
}
