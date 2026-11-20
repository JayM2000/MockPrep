"use client"

import * as React from "react"
import Link from "next/link"
import { Share2, Copy, Check, Clock, Globe, Lock, RotateCcw, Plus, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/services/projects/project.queries"
import { useRenewProjectMutation } from "@/services/projects/project.mutations"
import { ProjectShareModal } from "@/features/projects/components/project-share-modal"
import { useUserRole } from "@/context/user-role-context"
import { useCurrentTime } from "@/hooks/use-current-time"
import type { Project } from "@/services/projects/project.types"

export default function SharedLinksPage() {
  const { isCandidate } = useUserRole()
  const { data: projects, isLoading } = useProjects()
  const renewMutation = useRenewProjectMutation()
  const now = useCurrentTime()

  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [renewingId, setRenewingId] = React.useState<string | null>(null)
  const [selectedShareProject, setSelectedShareProject] = React.useState<Project | null>(null)

  const handleCopy = async (projectId: string, token: string) => {
    const url = `${window.location.origin}/p/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(projectId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback
    }
  }

  const handleRenew = async (projectId: string) => {
    try {
      setRenewingId(projectId)
      await renewMutation.mutateAsync({ id: projectId, expiryDays: 14 })
    } finally {
      setRenewingId(null)
    }
  }

  if (isCandidate) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <CardTitle className="text-base font-semibold">Assessor Access Only</CardTitle>
        <CardDescription className="text-xs mt-1">
          Shared link management is only available to Assessors.
        </CardDescription>
        <div className="mt-4">
          <Link href="/dashboard">
            <Button size="sm" variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </Card>
    )
  }

  const allProjects = projects ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Share2 className="size-6 text-primary" />
            Shared Project Links
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Distribute secret share tokens to candidates for private assessment access.
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="sm" className="gap-2 text-xs">
            <Plus className="size-3.5" />
            Create Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : allProjects.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Share2 className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">No Projects Created Yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
            Create a project to generate a shareable link that candidates can use to view and take assessments.
          </p>
          <Link href="/projects/new">
            <Button size="sm">Create New Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {allProjects.map((p) => {
            const expiresAt = new Date(p.expiresAt).getTime()
            const diffDays = now ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : p.expiryDays
            const isExpired = Boolean(now && diffDays <= 0)
            const isExpiringSoon = Boolean(now && diffDays > 0 && diffDays <= 3)
            const shareUrl = p.shareToken ? `/p/${p.shareToken}` : ""

            return (
              <Card key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm hover:underline">
                      <Link href={`/projects/${p.id}`}>{p.name}</Link>
                    </span>
                    {p.visibility === "public" ? (
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
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono text-[11px] truncate max-w-[200px] sm:max-w-xs bg-muted px-2 py-0.5 rounded">
                      {shareUrl}
                    </span>
                    <Badge
                      variant={isExpired ? "destructive" : isExpiringSoon ? "outline" : "secondary"}
                      className={`text-[10px] py-0 px-1.5 gap-1 ${
                        isExpiringSoon && !isExpired
                          ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                          : ""
                      }`}
                    >
                      <Clock className="size-2.5" />
                      {isExpired ? "Expired" : `Expires in ${diffDays}d`}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isExpired && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 h-8 border-amber-500/40 text-amber-600 dark:text-amber-400"
                      onClick={() => handleRenew(p.id)}
                      disabled={renewingId === p.id}
                    >
                      <RotateCcw className="size-3" />
                      {renewingId === p.id ? "Renewing..." : "Renew (+14d)"}
                    </Button>
                  )}

                  {p.shareToken && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 h-8 font-medium"
                        onClick={() => setSelectedShareProject(p)}
                        title="Open share and invitation modal"
                      >
                        <Share2 className="size-3 text-primary" />
                        <span>Manage Invites</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 h-8"
                        onClick={() => handleCopy(p.id, p.shareToken!)}
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="size-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </Button>
                      <Link href={`/p/${p.shareToken}`} target="_blank">
                        <Button variant="ghost" size="icon" className="size-8" title="Preview link as candidate">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Share & Invitations Modal */}
      <ProjectShareModal
        project={selectedShareProject}
        open={Boolean(selectedShareProject)}
        onOpenChange={(open) => {
          if (!open) setSelectedShareProject(null)
        }}
      />
    </div>
  )
}
