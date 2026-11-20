"use client"

import Link from "next/link"
import { Bookmark, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects, useBookmarks } from "@/services/projects/project.queries"
import { ProjectCard } from "@/features/projects/components/project-card"

export default function BookmarksPage() {
  const { data: bookmarks, isLoading: isBookmarksLoading } = useBookmarks()
  const { data: projects, isLoading: isProjectsLoading } = useProjects()

  const isLoading = isBookmarksLoading || isProjectsLoading

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.projectId) ?? [])
  const bookmarkedProjects = projects?.filter((p) => bookmarkedIds.has(p.id)) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bookmark className="size-6 text-primary" />
          Bookmarked Projects
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quickly access public challenges you have saved for interview prep and practice.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : bookmarkedProjects.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Bookmark className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
            Browse public projects in the Discover catalog and bookmark challenges to prepare at your own pace.
          </p>
          <Link href="/discover">
            <Button size="sm" className="gap-2 text-xs">
              <Compass className="size-3.5" />
              Discover Projects
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {bookmarkedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} showOwnerActions={false} />
          ))}
        </div>
      )}
    </div>
  )
}
