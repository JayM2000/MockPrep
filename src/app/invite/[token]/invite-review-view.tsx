"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Lock,
  Globe,
  AlertTriangle,
  PlaySquare,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { inviteService } from "@/services/invites/invite.service"
import { useUserRole } from "@/context/user-role-context"

export function InviteReviewView() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isAssessor, setRole } = useUserRole()

  const rawToken = params?.token
  const token = Array.isArray(rawToken) ? rawToken[0] : (rawToken as string)

  const candidateEmail = user?.primaryEmailAddress?.emailAddress

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["validate-invite", token, candidateEmail],
    queryFn: () => inviteService.validateInvite(token, candidateEmail),
    enabled: Boolean(token && isUserLoaded),
    retry: false,
  })

  const acceptMutation = useMutation({
    mutationFn: async () => {
      return inviteService.acceptInvite(token, candidateEmail)
    },
    onSuccess: (result) => {
      // Navigate to candidate session workspace
      router.push(`/sessions/${result.sessionId}`)
    },
  })

  if (isLoading || !isUserLoaded) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-12 px-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !data) {
    const errorMsg =
      error instanceof Error ? error.message : "This invitation is invalid, expired, or has been revoked."

    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="size-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Invitation Unavailable</h2>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <Button onClick={() => router.push("/dashboard")} variant="outline" size="sm">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const { invite, project, assessor, isEmailMatch } = data
  const isPrivate = project.visibility === "private"

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      {/* Assessor Persona Notice */}
      {isAssessor && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
              <ShieldAlert className="size-4 text-amber-500 shrink-0" />
              <span>Assessor Studio Preview</span>
            </div>
            <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px]">
              Assessor Logged In
            </Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            You are currently signed in as an <strong>Assessor</strong>. Candidates visiting this link will see this preview and click <strong>Accept & Start</strong> to launch their live 2-hour assessment session.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="default"
              className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground"
              onClick={async () => {
                await setRole("candidate")
              }}
            >
              <RefreshCw className="size-3" />
              <span>Switch to Candidate Mode to Take Challenge</span>
            </Button>
            <Link href={`/projects/${project.id}`}>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                <ArrowRight className="size-3" />
                <span>Manage Project in Assessor Studio</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Assessor Organization Header */}
      <div className="p-6 rounded-xl border border-border bg-gradient-to-r from-card via-card/80 to-muted/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/10 gap-1 text-[11px]"
            >
              <ShieldCheck className="size-3" />
              <span>Assessment Invitation</span>
            </Badge>

            {isPrivate ? (
              <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 text-[10px] gap-1">
                <Lock className="size-2.5" />
                Private Invite
              </Badge>
            ) : (
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 text-[10px] gap-1">
                <Globe className="size-2.5" />
                Public Challenge
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>Duration: <strong>120 mins</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{project.name}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Administered by {assessor.name || "Assessor"}{" "}
            {assessor.organization ? `at ${assessor.organization}` : ""}{" "}
            {assessor.title ? `(${assessor.title})` : ""}
          </p>
        </div>
      </div>

      {/* Private Email Match Warning */}
      {isPrivate && !isEmailMatch && invite.email && (
        <div className="p-4 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="size-4" />
            <span>Account Email Mismatch</span>
          </div>
          <p>
            This private invitation was issued to <strong>{invite.email}</strong>. You are currently signed in as <strong>{candidateEmail}</strong>. Please switch to the invited account to start.
          </p>
        </div>
      )}

      {/* Project Overview Card */}
      <Card>
        <CardHeader className="space-y-1.5 pb-3">
          <CardTitle className="text-base font-semibold">Assessment Scope & Requirements</CardTitle>
          <CardDescription className="text-xs">
            Review the codebase architecture and technical specifications before beginning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            {project.description || "Hands-on engineering assessment and architecture review."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
            <div>
              <span className="text-muted-foreground block text-[11px]">Difficulty</span>
              <span className="font-semibold">{project.difficulty}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Backend</span>
              <span className="font-semibold">{project.backendTech || "Node.js"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Frontend</span>
              <span className="font-semibold">{project.frontendTech || "Next.js / React"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[10px] font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules & Session Agreement Box */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs space-y-2 text-muted-foreground">
        <h4 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-primary" />
          <span>Candidate Assessment Rules</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 leading-relaxed text-[11px]">
          <li>Once you click <strong>Accept & Start</strong>, your 2-hour assessment session countdown begins immediately.</li>
          <li>You will be provided an isolated development environment containing the real codebase.</li>
          <li>Your code changes and architecture decisions will be evaluated for functional correctness and design quality.</li>
        </ul>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(isAssessor ? "/projects" : "/dashboard")}
          disabled={acceptMutation.isPending}
        >
          {isAssessor ? "Back to Projects" : "Cancel"}
        </Button>

        {isAssessor ? (
          <Button
            size="sm"
            onClick={async () => {
              await setRole("candidate")
              acceptMutation.mutate()
            }}
            disabled={acceptMutation.isPending || (isPrivate && !isEmailMatch)}
            className="gap-2 font-semibold bg-primary text-primary-foreground min-w-[200px]"
          >
            {acceptMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Switching & Initializing...</span>
              </>
            ) : (
              <>
                <PlaySquare className="size-3.5" />
                <span>Switch to Candidate & Start</span>
              </>
            )}
          </Button>
        ) : !user ? (
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
          >
            <Button size="sm" className="gap-2 font-semibold bg-primary text-primary-foreground min-w-[160px]">
              <PlaySquare className="size-3.5" />
              <span>Sign In to Accept & Start</span>
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending || (isPrivate && !isEmailMatch)}
            className="gap-2 font-semibold bg-primary text-primary-foreground min-w-[160px]"
          >
            {acceptMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Initializing Session...</span>
              </>
            ) : (
              <>
                <PlaySquare className="size-3.5" />
                <span>Accept & Start</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
