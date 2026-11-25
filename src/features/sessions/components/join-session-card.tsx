"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  Key,
  ShieldAlert,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserRole } from "@/context/user-role-context"
import { useJoinSessionMutation } from "@/services/sessions/session.queries"

interface JoinSessionCardProps {
  initialCode?: string
}

export function JoinSessionCard({ initialCode = "" }: JoinSessionCardProps) {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isAssessor, setRole, isLoading: isRoleLoading } = useUserRole()

  const [code, setCode] = React.useState(initialCode)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSwitchingRole, setIsSwitchingRole] = React.useState(false)

  const joinMutation = useJoinSessionMutation()

  // Clean code input (strips full URLs if user pasted a link)
  const getSanitizedCode = (raw: string): string => {
    let cleaned = raw.trim()
    if (cleaned.includes("/invite/")) {
      cleaned = cleaned.split("/invite/")[1]?.split(/[?#/]/)[0] || cleaned
    } else if (cleaned.includes("/join/")) {
      cleaned = cleaned.split("/join/")[1]?.split(/[?#/]/)[0] || cleaned
    }
    return cleaned
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const sanitized = getSanitizedCode(code)
    if (!sanitized) {
      setErrorMessage("Please enter a valid invitation code or secret token.")
      return
    }

    const candidateEmail = user?.primaryEmailAddress?.emailAddress

    joinMutation.mutate(
      { code: sanitized, candidateEmail },
      {
        onSuccess: (session) => {
          router.push(`/sessions/${session.id}`)
        },
        onError: (err) => {
          const msg =
            err instanceof Error
              ? err.message
              : "Unable to join session. The code may be invalid, expired, or fully utilized."
          setErrorMessage(msg)
        },
      }
    )
  }

  // Handle Assessor barrier
  if (isAssessor) {
    return (
      <Card className="w-full max-w-md border-amber-500/40 bg-card/95 shadow-xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-2">
            <ShieldAlert className="size-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Candidate Access Only
          </CardTitle>
          <CardDescription className="text-sm">
            Joining assessment sessions via code is exclusively for Candidates. Assessors cannot join candidate sessions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs text-muted-foreground text-center">
          <div className="p-3 rounded-lg border border-border bg-muted/30 text-left space-y-1">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="size-3.5 text-amber-500" />
              Role Restriction Enforced
            </span>
            <p>
              You are currently registered as an <strong>Assessor</strong>. If you want to experience or take this challenge as a candidate, switch your active persona below.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            className="w-full gap-2 font-semibold bg-primary text-primary-foreground"
            disabled={isSwitchingRole}
            onClick={async () => {
              try {
                setIsSwitchingRole(true)
                await setRole("candidate")
              } catch (e) {
                console.error(e)
              } finally {
                setIsSwitchingRole(false)
              }
            }}
          >
            {isSwitchingRole ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Switching to Candidate...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                <span>Switch to Candidate Mode</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full text-xs"
            onClick={() => router.push("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border bg-card/95">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <Key className="size-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          Join Assessment Session
        </CardTitle>
        <CardDescription className="text-sm">
          Enter the invitation code or token provided by your assessor to unlock your test environment.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="invite-code" className="text-xs font-semibold text-foreground">
              Invitation Code or Token
            </label>
            <Input
              id="invite-code"
              type="text"
              placeholder="e.g. 43f7d406 or paste link/token"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-center tracking-wider text-sm h-11"
              autoFocus
              disabled={joinMutation.isPending}
            />
            <p className="text-[11px] text-muted-foreground">
              Supports 8-character codes, 32-byte secret tokens, or pasted project links.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            className="w-full gap-2 font-semibold bg-primary text-primary-foreground h-10"
            disabled={joinMutation.isPending || !code.trim()}
          >
            {joinMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Validating & Initializing...</span>
              </>
            ) : (
              <>
                <span>Enter Assessment</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <Link href="/dashboard" className="w-full text-center">
            <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Cancel & Return
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
