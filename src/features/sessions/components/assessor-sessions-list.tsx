"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  FolderGit2,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SessionStatusBadge } from "./session-status-badge"
import { SessionTimer } from "./session-timer"
import type { AssessmentSession } from "@/types/session.types"

interface AssessorSessionsListProps {
  sessions: AssessmentSession[]
}

export function AssessorSessionsList({ sessions }: AssessorSessionsListProps) {
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("all")

  // Extract distinct projects for filter dropdown
  const uniqueProjects = React.useMemo(() => {
    const map = new Map<string, string>()
    sessions.forEach((s) => {
      if (!map.has(s.projectId)) {
        map.set(s.projectId, s.project.name)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [sessions])

  const filteredSessions = React.useMemo(() => {
    if (selectedProjectId === "all") return sessions
    return sessions.filter((s) => s.projectId === selectedProjectId)
  }, [sessions, selectedProjectId])

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/40">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-4">
          <Users className="size-6" />
        </div>
        <h3 className="text-base font-semibold">No candidate sessions yet</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto mb-6">
          When candidates accept your project invitation links or challenge codes, their assessment sessions and live progress will be tracked here.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/projects">
            <Button size="sm" variant="default" className="gap-2">
              <FolderGit2 className="size-4" />
              Manage Projects
            </Button>
          </Link>
          <Link href="/links">
            <Button size="sm" variant="outline" className="gap-2">
              <ShieldCheck className="size-4" />
              Shared Links
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border bg-card/60">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Filter className="size-3.5 text-primary" />
          <span>Filter by Project:</span>
          <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val || "all")}>
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects ({sessions.length})</SelectItem>
              {uniqueProjects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredSessions.length}</strong> candidate{" "}
          {filteredSessions.length === 1 ? "session" : "sessions"}
        </div>
      </div>

      {/* Sessions Table / Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filteredSessions.map((session) => (
          <Card
            key={session.id}
            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-border/80 transition-colors"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SessionStatusBadge status={session.status} />
                <Badge variant="outline" className="text-[11px] font-mono">
                  {session.project.difficulty}
                </Badge>
                <span className="text-xs font-semibold text-foreground truncate">
                  {session.project.name}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Mail className="size-3 text-muted-foreground" />
                  <span>{session.candidateEmail || `Candidate #${session.candidateId.slice(0, 8)}`}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>
                    {session.startedAt
                      ? `Started ${new Date(session.startedAt).toLocaleString()}`
                      : `Created ${new Date(session.createdAt).toLocaleDateString()}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>Duration: {session.durationMins}m</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <SessionTimer
                startedAt={session.startedAt}
                durationMins={session.durationMins}
                status={session.status}
                showLabel={false}
              />

              <Link href={`/sessions/${session.id}`}>
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs font-medium">
                  <span>Supervisor View</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
