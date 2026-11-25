"use client"

import * as React from "react"
import Link from "next/link"
import { Key, FolderGit2, Share2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserRole } from "@/context/user-role-context"
import { useSessions } from "@/services/sessions/session.queries"
import { CandidateSessionsList } from "@/features/sessions/components/candidate-sessions-list"
import { AssessorSessionsList } from "@/features/sessions/components/assessor-sessions-list"

export default function SessionsPage() {
  const { isAssessor, isLoading: isRoleLoading } = useUserRole()
  const { data: sessions, isLoading: isSessionsLoading, error } = useSessions()

  const isLoading = isRoleLoading || isSessionsLoading

  return (
    <div className="space-y-6">
      {/* Dynamic Role-Aware Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAssessor ? "Candidate Assessment Sessions" : "My Assessment Sessions"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAssessor
              ? "Review candidate assessments and track active test environments across your projects."
              : "Access your coding challenges, active environments, and track assessment progress."}
          </p>
        </div>

        {/* Action Buttons: Strictly NO 'Join via Code' for Assessor! */}
        <div className="flex items-center gap-2">
          {isAssessor ? (
            <div className="flex items-center gap-2">
              <Link href="/projects">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <FolderGit2 className="size-3.5" />
                  <span>Projects</span>
                </Button>
              </Link>
              <Link href="/links">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Share2 className="size-3.5" />
                  <span>Shared Links</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/join">
              <Button size="sm" className="gap-2 font-medium bg-primary text-primary-foreground">
                <Key className="size-4" />
                <span>Join via Code</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h3 className="text-base font-semibold text-destructive">Failed to load sessions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "An unexpected error occurred while fetching sessions."}
          </p>
        </div>
      ) : isAssessor ? (
        <AssessorSessionsList sessions={sessions || []} />
      ) : (
        <CandidateSessionsList sessions={sessions || []} />
      )}
    </div>
  )
}
