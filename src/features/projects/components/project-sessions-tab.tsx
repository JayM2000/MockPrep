"use client"

import * as React from "react"
import Link from "next/link"
import { PlaySquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSessions } from "@/services/sessions/session.queries"
import { AssessorSessionsList } from "@/features/sessions/components/assessor-sessions-list"

interface ProjectSessionsTabProps {
  projectId: string
}

export function ProjectSessionsTab({ projectId }: ProjectSessionsTabProps) {
  const { data: sessions, isLoading, error } = useSessions(projectId)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <h3 className="text-base font-semibold text-destructive">Failed to load project sessions</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unable to load candidate sessions for this project."}
        </p>
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/40">
        <PlaySquare className="mx-auto size-10 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-semibold">No candidate sessions for this project</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto mb-5">
          Candidate attempts will appear here in real-time when they accept invitations or open universal challenge links.
        </p>
        <Link href="/links">
          <Button size="sm" variant="outline" className="gap-2">
            <Share2 className="size-3.5" />
            Distribute Project Invites
          </Button>
        </Link>
      </div>
    )
  }

  return <AssessorSessionsList sessions={sessions} />
}
