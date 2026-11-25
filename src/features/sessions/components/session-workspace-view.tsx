"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Layers,
  Code2,
  Terminal,
  Building2,
  User,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserRole } from "@/context/user-role-context"
import {
  useSession,
  useStartSessionMutation,
  useCompleteSessionMutation,
} from "@/services/sessions/session.queries"
import { SessionStatusBadge } from "./session-status-badge"
import { SessionTimer } from "./session-timer"

interface SessionWorkspaceViewProps {
  sessionId: string
}

export function SessionWorkspaceView({ sessionId }: SessionWorkspaceViewProps) {
  const router = useRouter()
  const { isAssessor, role } = useUserRole()
  const { data: session, isLoading, error } = useSession(sessionId)

  const startMutation = useStartSessionMutation()
  const completeMutation = useCompleteSessionMutation()

  const [showSubmitModal, setShowSubmitModal] = React.useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-72 md:col-span-2 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !session) {
    const errorMsg =
      error instanceof Error ? error.message : "Session could not be found or you do not have permission to access it."

    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="size-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Session Unavailable</h2>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <Button onClick={() => router.push("/sessions")} variant="outline" size="sm">
          Back to Sessions
        </Button>
      </div>
    )
  }

  const { project, assessor, status } = session
  const isReady = status === "ready"
  const isInProgress = status === "in_progress"
  const isCompleted = status === "completed"
  const isExpired = status === "expired"

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/sessions">
            <Button variant="ghost" size="icon-sm" aria-label="Back to sessions">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
              <SessionStatusBadge status={status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Session ID: <code className="font-mono">{session.id}</code>
            </p>
          </div>
        </div>

        {/* Live Timer or State badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SessionTimer
            startedAt={session.startedAt}
            durationMins={session.durationMins}
            status={status}
          />
        </div>
      </div>

      {/* Assessor Supervisor Banner (Strictly Read-Only) */}
      {isAssessor && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
              <ShieldAlert className="size-4 text-amber-500 shrink-0" />
              <span>Assessor Supervisor Mode (Read-Only)</span>
            </div>
            <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px]">
              Assessor View
            </Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            You are supervising candidate <strong>{session.candidateEmail || session.candidateId}</strong>.
            Assessment start and submission controls are exclusively operable by the candidate.
          </p>
        </div>
      )}

      {/* Ready State Callout for Candidate */}
      {!isAssessor && isReady && (
        <Card className="border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-card to-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-500">
              <Play className="size-5" />
              <CardTitle className="text-lg">Ready to Begin Assessment?</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Your test environment is pre-configured. Once you click <strong>Start Assessment</strong>, your{" "}
              <strong>{session.durationMins}-minute</strong> countdown timer will activate immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              onClick={() => startMutation.mutate(session.id)}
              disabled={startMutation.isPending}
              className="gap-2 font-semibold bg-primary text-primary-foreground"
            >
              {startMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Starting Environment...</span>
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  <span>Start Assessment Timer</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed State Callout */}
      {isCompleted && (
        <Card className="border-emerald-500/40 bg-emerald-500/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
              <CardTitle className="text-lg">Assessment Completed & Submitted</CardTitle>
            </div>
            <CardDescription className="text-sm">
              This session was completed on{" "}
              {session.endsAt ? new Date(session.endsAt).toLocaleString() : "record"}. Your evaluation is now
              archived for assessor review.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* In-Progress Candidate Workspace Header */}
      {!isAssessor && isInProgress && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <Terminal className="size-4 text-primary" />
              <span>Assessment In Progress</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Work on your challenge tasks. When finished, click <strong>Submit Assessment</strong> below.
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            disabled={completeMutation.isPending}
            className="gap-2 font-semibold shadow-sm"
          >
            <CheckCircle2 className="size-4" />
            <span>Submit & Complete</span>
          </Button>
        </div>
      )}

      {/* Workspace Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Challenge Overview & Tech Specs */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderGit2 className="size-4 text-primary" />
                <span>Challenge Specifications</span>
              </CardTitle>
              {project.description && (
                <CardDescription className="text-sm leading-relaxed mt-2 text-foreground/90">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-border bg-card/60">
                  <span className="text-[11px] text-muted-foreground block">Difficulty</span>
                  <span className="text-xs font-semibold uppercase font-mono">{project.difficulty}</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/60">
                  <span className="text-[11px] text-muted-foreground block">Category</span>
                  <span className="text-xs font-semibold">{project.category || "Full-Stack"}</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/60">
                  <span className="text-[11px] text-muted-foreground block">Time Limit</span>
                  <span className="text-xs font-semibold font-mono">{session.durationMins} minutes</span>
                </div>
              </div>

              {/* Tech Stack Details */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Technical Architecture
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="font-mono text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.frontendTech && (
                    <Badge variant="outline" className="text-xs">
                      UI: {project.frontendTech}
                    </Badge>
                  )}
                  {project.backendTech && (
                    <Badge variant="outline" className="text-xs">
                      API: {project.backendTech}
                    </Badge>
                  )}
                  {project.databaseTech && (
                    <Badge variant="outline" className="text-xs">
                      DB: {project.databaseTech}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Guidelines Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                <span>Assessment Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                1. Review the repository architecture, requirements, and challenge problem statements thoroughly.
              </p>
              <p>
                2. Implement clean, modular code adhering to the specified tech stack conventions and best practices.
              </p>
              <p>
                3. Ensure all unit and integration test suites compile and execute cleanly before submitting.
              </p>
              <p>
                4. When you are confident in your solution, click <strong>Submit & Complete</strong> to seal your assessment submission.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Assessor & Environment Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>Assessor Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {(assessor.name || "A")[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{assessor.name || "Lead Assessor"}</div>
                  {assessor.title && <div className="text-muted-foreground">{assessor.title}</div>}
                </div>
              </div>

              {assessor.organization && (
                <div className="flex items-center gap-2 text-muted-foreground pt-1 border-t border-border">
                  <Building2 className="size-3.5" />
                  <span>{assessor.organization}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <span>Session Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Status</span>
                <SessionStatusBadge status={status} />
              </div>

              <div className="flex justify-between items-center">
                <span>Duration</span>
                <span className="font-mono text-foreground">{session.durationMins} mins</span>
              </div>

              {session.startedAt && (
                <div className="flex justify-between items-center">
                  <span>Started At</span>
                  <span className="font-mono text-foreground">
                    {new Date(session.startedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {session.candidateEmail && (
                <div className="flex justify-between items-center">
                  <span>Candidate</span>
                  <span className="text-foreground truncate max-w-[150px]">{session.candidateEmail}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Assessment Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in fade-in zoom-in-95 duration-150">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                <CardTitle className="text-base">Submit Assessment?</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Are you sure you want to finalize and submit your assessment session? Once submitted, your
                code snapshot is locked and you cannot resume editing.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSubmitModal(false)}
                disabled={completeMutation.isPending}
              >
                Continue Working
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  completeMutation.mutate(session.id, {
                    onSuccess: () => setShowSubmitModal(false),
                  })
                }}
                disabled={completeMutation.isPending}
                className="gap-2"
              >
                {completeMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Yes, Submit Now</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
