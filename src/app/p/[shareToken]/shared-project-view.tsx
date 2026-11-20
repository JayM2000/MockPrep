"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Clock,
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSharedProject } from "@/services/projects/project.queries"
import { inviteService } from "@/services/invites/invite.service"
import { BrandLogo } from "@/components/shared/brand-logo"
import { useCurrentTime } from "@/hooks/use-current-time"

interface SharedProjectViewProps {
  shareToken: string
}

export function SharedProjectView({ shareToken }: SharedProjectViewProps) {
  const router = useRouter()
  const { data: project, isLoading, error } = useSharedProject(shareToken)
  const now = useCurrentTime()

  // Seamless redirect: if this token is actually an invite token, forward to /invite/[token]
  React.useEffect(() => {
    if (error && shareToken) {
      inviteService
        .validateInvite(shareToken)
        .then((res) => {
          if (res?.invite) {
            router.replace(`/invite/${shareToken}`)
          }
        })
        .catch(() => {
          // Genuinely invalid or expired project link
        })
    }
  }, [error, shareToken, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="mb-6 flex justify-center">
            <BrandLogo />
          </div>

          <Card className="border-destructive/30 bg-destructive/5 p-6 space-y-4">
            <div className="mx-auto size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="size-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">Project Link Expired or Invalid</CardTitle>
              <CardDescription className="text-xs">
                This project share link has either expired or does not exist. All MockPrep projects carry an expiration limit (7 to 30 days) set by the Assessor.
              </CardDescription>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/discover">
                <Button size="sm" className="w-full gap-2">
                  <Compass className="size-3.5" />
                  Explore Public Projects
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Calculate days remaining
  const expiresAt = new Date(project.expiresAt).getTime()
  const diffDays = now ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : project.expiryDays

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Top Logo */}
        <div className="flex items-center justify-between">
          <BrandLogo />
          <Badge variant="outline" className="text-xs gap-1.5 py-1">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            Verified Assessment Link
          </Badge>
        </div>

        {/* Project Overview Card */}
        <Card className="border-2 border-border/80 shadow-lg">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {project.category}
                </span>
                {project.visibility === "public" ? (
                  <Badge variant="outline" className="text-[10px] gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    <Globe className="size-2.5" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] gap-1 border-muted-foreground/30 text-muted-foreground">
                    <Lock className="size-2.5" />
                    Private Link
                  </Badge>
                )}
              </div>

              <Badge
                variant="outline"
                className="text-xs gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
              >
                <Clock className="size-3" />
                Expires in {diffDays} {diffDays === 1 ? "day" : "days"}
              </Badge>
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">
              {project.name}
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed text-foreground/80">
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-0">
            {/* Tech Stack Specs */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 p-3.5 rounded-lg border border-border bg-muted/20 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Frontend</span>
                <span className="font-semibold text-foreground truncate block">{project.frontendTech}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Backend</span>
                <span className="font-semibold text-foreground truncate block">{project.backendTech}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Database</span>
                <span className="font-semibold text-foreground truncate block">{project.database}</span>
              </div>
            </div>

            {/* Tags & Complexity */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="text-xs capitalize font-medium">
                Difficulty: {project.complexity}
              </Badge>
              {project.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Layers className="size-3.5" />
                <span>Ready for interview challenge simulation</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link href="/dashboard" className="flex-1 sm:flex-initial">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Dashboard
                  </Button>
                </Link>
                <Link href={`/projects/${project.id}`} className="flex-1 sm:flex-initial">
                  <Button size="sm" className="w-full gap-2 text-xs">
                    <span>Enter Project</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
