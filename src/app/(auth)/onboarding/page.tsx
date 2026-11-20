"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Code2, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUserRole } from "@/context/user-role-context"
import { AssessorActivationModal } from "@/components/shared/assessor-activation-modal"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/user.types"

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const { role, setRole, isAssessorRegistered, isLoading } = useUserRole()

  const [userSelectedRole, setUserSelectedRole] = React.useState<UserRole | null>(null)
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Derive active selection: user selection takes precedence, otherwise fallback to existing role or candidate
  const selectedRole: UserRole = userSelectedRole ?? (role ?? "candidate")

  const handleComplete = async () => {
    try {
      setError(null)
      const displayName = user?.fullName || user?.firstName || undefined

      // If user selected Assessor and is not registered as Assessor yet, capture profile details first
      if (selectedRole === "assessor" && !isAssessorRegistered) {
        setIsActivationModalOpen(true)
        return
      }

      setIsSubmitting(true)
      await setRole(selectedRole, displayName)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set role. Please try again.")
      setIsSubmitting(false)
    }
  }

  const isRoleAlreadyAssigned = Boolean(role)
  const isChangingExistingRole = isRoleAlreadyAssigned && selectedRole !== role

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted border border-border">
            <Sparkles className="size-3.5 text-primary" />
            <span>Dual-Persona Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isRoleAlreadyAssigned ? "Your Workspace Role" : "Choose Your Starting Role"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {isRoleAlreadyAssigned
              ? "You can freely toggle between Candidate and Assessor modes at any time."
              : "Welcome to MockPrep! Select your primary role to configure your initial dashboard. You can switch personas anytime with one click."}
          </p>
        </div>

        {/* Existing Role Information Banner */}
        {isRoleAlreadyAssigned && (
          <div
            className={cn(
              "flex items-center justify-between p-3.5 rounded-xl border text-xs",
              role === "assessor"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                : "border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    role === "assessor" ? "bg-amber-400" : "bg-blue-400"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-full size-2",
                    role === "assessor" ? "bg-amber-500" : "bg-blue-500"
                  )}
                />
              </span>
              <span>
                Currently active as: <strong className="capitalize">{role}</strong>
              </span>
            </div>
            <Link href="/dashboard" className="font-semibold underline underline-offset-2 hover:opacity-80">
              Skip to Dashboard →
            </Link>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Candidate Card */}
          <Card
            onClick={() => setUserSelectedRole("candidate")}
            className={cn(
              "cursor-pointer transition-all border-2 relative overflow-hidden",
              selectedRole === "candidate"
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40"
                : "border-border hover:border-blue-500/40 bg-card"
            )}
          >
            {selectedRole === "candidate" && (
              <div className="absolute top-3 right-3 text-blue-500">
                <CheckCircle2 className="size-5 fill-blue-500 text-background" />
              </div>
            )}
            {role === "candidate" && (
              <Badge
                variant="outline"
                className="absolute top-3 left-3 text-[10px] font-semibold border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10"
              >
                Current Active
              </Badge>
            )}
            <CardHeader className={cn("space-y-3", role === "candidate" && "pt-10")}>
              <div className="size-12 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Code2 className="size-6" />
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>Candidate</span>
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                For developers preparing for technical interviews, exploring real codebases, and taking practice challenges.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5 pt-0">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Discover public engineering challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Save & bookmark interesting projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Join private assessment sessions via invite</span>
              </div>
            </CardContent>
          </Card>

          {/* Assessor Card */}
          <Card
            onClick={() => setUserSelectedRole("assessor")}
            className={cn(
              "cursor-pointer transition-all border-2 relative overflow-hidden",
              selectedRole === "assessor"
                ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                : "border-border hover:border-amber-500/40 bg-card"
            )}
          >
            {selectedRole === "assessor" && (
              <div className="absolute top-3 right-3 text-amber-500">
                <CheckCircle2 className="size-5 fill-amber-500 text-background" />
              </div>
            )}
            {role === "assessor" && (
              <Badge
                variant="outline"
                className="absolute top-3 left-3 text-[10px] font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
              >
                Current Active
              </Badge>
            )}
            <CardHeader className={cn("space-y-3", role === "assessor" && "pt-10")}>
              <div className="size-12 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="size-6" />
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>Assessor</span>
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                For engineering leads and mentors designing interview architectures, setting expiry limits, and evaluating candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5 pt-0">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Create public & private projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Generate secret shareable access links</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Set flexible project expiry (7–30 days)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reassurance Callout */}
        <div className="p-3.5 rounded-xl border border-muted bg-muted/30 text-xs text-muted-foreground flex items-center gap-2.5">
          <ArrowLeftRight className="size-4 shrink-0 text-primary" />
          <span>
            <strong>Dual-mode flexibility:</strong> Switching between Candidate and Assessor is instant and available anywhere via the top navbar or sidebar.
          </span>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            size="lg"
            className={cn(
              "w-full sm:w-auto min-w-[220px] gap-2 font-semibold shadow-md",
              selectedRole === "assessor"
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
            )}
            onClick={handleComplete}
            disabled={isSubmitting || isLoading}
          >
            <span>
              {isSubmitting
                ? "Updating Workspace..."
                : selectedRole === "assessor" && !isAssessorRegistered
                  ? "Configure Assessor Workspace"
                  : isChangingExistingRole
                    ? `Switch Role to ${selectedRole === "candidate" ? "Candidate" : "Assessor"}`
                    : `Continue as ${selectedRole === "candidate" ? "Candidate" : "Assessor"}`}
            </span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* First-Time Assessor Activation Dialog on Onboarding */}
      <AssessorActivationModal
        open={isActivationModalOpen}
        onOpenChange={setIsActivationModalOpen}
        onSuccess={() => router.push("/dashboard")}
      />
    </div>
  )
}
