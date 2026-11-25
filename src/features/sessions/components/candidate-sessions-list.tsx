import Link from "next/link"
import { PlaySquare, Key, ArrowRight, ExternalLink, Building2, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SessionStatusBadge } from "./session-status-badge"
import { SessionTimer } from "./session-timer"
import type { AssessmentSession } from "@/types/session.types"

interface CandidateSessionsListProps {
  sessions: AssessmentSession[]
}

export function CandidateSessionsList({ sessions }: CandidateSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/40">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <PlaySquare className="size-6" />
        </div>
        <h3 className="text-base font-semibold">No assessment sessions found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          You haven&apos;t joined any challenge sessions yet. Enter an invitation code from your interviewer to start.
        </p>
        <Link href="/join">
          <Button size="sm" className="gap-2 font-medium">
            <Key className="size-4" />
            Join via Code
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessions.map((session) => {
        const isReady = session.status === "ready"
        const isInProgress = session.status === "in_progress"
        const isCompleted = session.status === "completed"

        return (
          <Card key={session.id} className="flex flex-col justify-between hover:border-primary/40 transition-colors">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-bold line-clamp-1">
                    {session.project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-xs mt-0.5">
                    {session.project.category || "Full-Stack Challenge"} · {session.project.difficulty}
                  </CardDescription>
                </div>
                <SessionStatusBadge status={session.status} />
              </div>

              {session.project.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {session.project.description}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-3 flex-1">
              {/* Assessor Details */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg">
                <User className="size-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground truncate">
                  {session.assessor.name || "Interviewer"}
                </span>
                {session.assessor.organization && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="truncate flex items-center gap-1">
                      <Building2 className="size-3" />
                      {session.assessor.organization}
                    </span>
                  </>
                )}
              </div>

              {/* Tech Stack Pills */}
              {session.project.techStack && session.project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {session.project.techStack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                      {tech}
                    </Badge>
                  ))}
                  {session.project.techStack.length > 4 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{session.project.techStack.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {/* Timer / Duration */}
              <div className="pt-1">
                <SessionTimer
                  startedAt={session.startedAt}
                  durationMins={session.durationMins}
                  status={session.status}
                />
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/50 pt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-[11px]">
                {session.startedAt
                  ? `Started ${new Date(session.startedAt).toLocaleDateString()}`
                  : `Created ${new Date(session.createdAt).toLocaleDateString()}`}
              </span>

              <Link href={`/sessions/${session.id}`}>
                <Button
                  size="sm"
                  variant={isInProgress ? "default" : isReady ? "default" : "outline"}
                  className="gap-1.5 h-8 text-xs font-semibold"
                >
                  {isReady && <span>Start Assessment</span>}
                  {isInProgress && <span>Resume Session</span>}
                  {isCompleted && <span>View Submission</span>}
                  {!isReady && !isInProgress && !isCompleted && <span>View Workspace</span>}
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
