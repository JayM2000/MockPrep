"use client"

import * as React from "react"
import { Clock, Globe, Lock, Share2, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCurrentTime } from "@/hooks/use-current-time"
import { ProjectShareModal } from "@/features/projects/components/project-share-modal"
import type { Project } from "@/services/projects/project.types"

interface ProjectConfigTabProps {
  project: Project
}

export function ProjectConfigTab({ project }: ProjectConfigTabProps) {
  const [shareOpen, setShareOpen] = React.useState(false)
  const now = useCurrentTime()

  const expiresAt = new Date(project.expiresAt).getTime()
  const diffDays = now ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : project.expiryDays
  const isExpired = Boolean(now && diffDays <= 0)
  const isExpiringSoon = Boolean(now && diffDays > 0 && diffDays <= 3)

  return (
    <div className="space-y-6">
      {/* Access and Expiration Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Share2 className="size-4 text-primary" />
                Access Permissions & Candidate Invitations
              </CardTitle>
              <CardDescription>
                Control candidate access, issue private email invites, or distribute tracked public links
              </CardDescription>
            </div>
            <Button
              size="sm"
              className="gap-2 text-xs shrink-0"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="size-3.5" />
              Manage Invites & Share
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border p-3.5 space-y-2">
              <span className="text-xs text-muted-foreground font-medium">Visibility Policy</span>
              <div className="flex items-center gap-2">
                {project.visibility === "public" ? (
                  <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                    <Globe className="size-3" />
                    Public (Discoverable & Public Link Allowed)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400">
                    <Lock className="size-3" />
                    Private (Strict Email Invitation Only)
                  </Badge>
                )}
              </div>
            </div>

            <div className="rounded-md border border-border p-3.5 space-y-2">
              <span className="text-xs text-muted-foreground font-medium">Project Lifetime</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isExpired ? "destructive" : isExpiringSoon ? "outline" : "secondary"}
                  className={`gap-1 ${
                    isExpiringSoon && !isExpired
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                      : ""
                  }`}
                >
                  <Clock className="size-3" />
                  {isExpired ? "Expired" : `Expires in ${diffDays} days`}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ({project.expiryDays}d window)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border p-3.5 space-y-2 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                Invitation & Share Controls
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 h-7"
                onClick={() => setShareOpen(true)}
              >
                Configure
              </Button>
            </div>
            <p className="text-xs text-foreground">
              {project.visibility === "private"
                ? "This project is Private. Candidates can only access this project when sent a direct, single-use email invitation matching their account email."
                : "This project is Public. You can invite candidates directly via email or generate a tracked, rate-limited public invite link."}
            </p>
          </div>
        </CardContent>
      </Card>

      <ProjectShareModal
        project={project}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />

      {/* Tech Stack Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Technical Stack & Environment Configuration</CardTitle>
          <CardDescription>Configured frameworks, runtimes, and databases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
            <div className="rounded-md border border-border p-3">
              <dt className="text-xs text-muted-foreground font-medium">Frontend Framework</dt>
              <dd className="mt-1 font-mono text-sm">{project.frontendTech}</dd>
            </div>
            <div className="rounded-md border border-border p-3">
              <dt className="text-xs text-muted-foreground font-medium">Backend Runtime / API</dt>
              <dd className="mt-1 font-mono text-sm">{project.backendTech}</dd>
            </div>
            <div className="rounded-md border border-border p-3">
              <dt className="text-xs text-muted-foreground font-medium">Primary Database</dt>
              <dd className="mt-1 font-mono text-sm">{project.database}</dd>
            </div>
            <div className="rounded-md border border-border p-3">
              <dt className="text-xs text-muted-foreground font-medium">Repository State</dt>
              <dd className="mt-1 font-mono text-sm capitalize">{project.status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
