"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Layers,
  Lock,
  Globe,
  Clock,
  Bookmark,
  BookmarkCheck,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectStatusBadge } from "./project-status-badge"
import { ProjectShareModal } from "./project-share-modal"
import { useUserRole } from "@/context/user-role-context"
import { useCurrentTime } from "@/hooks/use-current-time"
import { useBookmarks } from "@/services/projects/project.queries"
import {
  useBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@/services/projects/project.mutations"
import type { Project } from "@/services/projects/project.types"

interface ProjectCardProps {
  project: Project
  showOwnerActions?: boolean
}

export function ProjectCard({ project, showOwnerActions = true }: ProjectCardProps) {
  const { isAssessor, isCandidate } = useUserRole()
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)

  // Bookmarking hooks for Candidates
  const { data: bookmarks } = useBookmarks()
  const bookmarkMutation = useBookmarkMutation()
  const removeBookmarkMutation = useRemoveBookmarkMutation()

  const isBookmarked = Boolean(
    bookmarks?.some((b) => b.projectId === project.id)
  )

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isBookmarked) {
      await removeBookmarkMutation.mutateAsync(project.id)
    } else {
      await bookmarkMutation.mutateAsync(project.id)
    }
  }

  const now = useCurrentTime()

  // Calculate days remaining until expiry
  const expiresAt = new Date(project.expiresAt).getTime()
  const diffDays = now ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : project.expiryDays
  const isExpired = Boolean(now && diffDays <= 0)
  const isExpiringSoon = Boolean(now && diffDays > 0 && diffDays <= 3)

  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className={`flex flex-col justify-between hover:border-foreground/30 transition-colors ${isExpired ? "opacity-75 bg-muted/20" : ""}`}>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{project.category}</span>
              {/* Visibility Badge */}
              {project.visibility === "public" ? (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <Globe className="size-2.5" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 gap-1 border-muted-foreground/30 text-muted-foreground">
                  <Lock className="size-2.5" />
                  Private
                </Badge>
              )}
            </div>

            <CardTitle className="text-base font-semibold leading-snug">
              <Link href={`/projects/${project.id}`} className="hover:underline">
                {project.name}
              </Link>
            </CardTitle>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCandidate && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={handleToggleBookmark}
                title={isBookmarked ? "Remove bookmark" : "Bookmark project"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="size-4 text-primary fill-primary/20" />
                ) : (
                  <Bookmark className="size-4" />
                )}
              </Button>
            )}
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>

        <CardDescription className="line-clamp-2 text-xs">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-wrap items-center gap-1">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal capitalize">
            {project.complexity}
          </Badge>
          {/* Expiry Pill */}
          <Badge
            variant={isExpired ? "destructive" : isExpiringSoon ? "outline" : "secondary"}
            className={`text-[10px] py-0 px-1.5 gap-1 font-normal ${
              isExpiringSoon && !isExpired
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                : ""
            }`}
          >
            <Clock className="size-2.5" />
            {isExpired ? "Expired" : `Expires in ${diffDays}d`}
          </Badge>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]" title={`${project.frontendTech} / ${project.backendTech}`}>
            <Layers className="size-3.5 shrink-0" />
            <span className="truncate">{project.backendTech?.split(" ")[0] || "Backend"}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="size-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {isAssessor && showOwnerActions && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 shrink-0"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsShareModalOpen(true)
              }}
              title="Share and manage invitations"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </Button>
          )}

          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full justify-between text-xs">
              <span>View Details</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Dedicated Share & Invitation Modal */}
        <ProjectShareModal
          project={project}
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
        />
      </CardContent>
    </Card>
  )
}
