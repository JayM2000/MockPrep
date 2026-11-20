"use client"

import * as React from "react"
import { Code2, ShieldCheck, CheckCircle2, Loader2, ArrowLeftRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserRole } from "@/context/user-role-context"
import { AssessorActivationModal } from "@/components/shared/assessor-activation-modal"
import type { UserRole } from "@/types/user.types"

export default function SettingsPage() {
  const { role, setRole, isAssessorRegistered, isLoading } = useUserRole()
  const [switchingTo, setSwitchingTo] = React.useState<UserRole | null>(null)
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)

  const handleSwitch = async (newRole: UserRole) => {
    if (newRole === role || switchingTo) return

    if (newRole === "assessor" && !isAssessorRegistered) {
      setIsActivationModalOpen(true)
      return
    }

    try {
      setSwitchingTo(newRole)
      await setRole(newRole)
    } finally {
      setSwitchingTo(null)
    }
  }

  const isAssessor = role === "assessor"

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Platform preferences, active workspace persona, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Workspace Role Switcher Card */}
        <Card className="border-2 border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ArrowLeftRight className="size-4 text-primary" />
                  Active Workspace Role
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Switch between your Candidate and Assessor profiles anytime.
                </CardDescription>
              </div>

              {!isLoading && role && (
                <Badge
                  variant="outline"
                  className={`text-xs gap-1.5 py-1 px-2.5 font-semibold capitalize ${
                    isAssessor
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                      : "border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                  }`}
                >
                  <span className="relative flex size-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isAssessor ? "bg-amber-400" : "bg-blue-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full size-2 ${
                        isAssessor ? "bg-amber-500" : "bg-blue-500"
                      }`}
                    />
                  </span>
                  {role} Mode Active
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Candidate Option */}
              <div
                onClick={() => handleSwitch("candidate")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                  role === "candidate"
                    ? "border-blue-500 bg-blue-500/5 shadow-xs"
                    : "border-border hover:border-muted-foreground/40 bg-card"
                }`}
              >
                {role === "candidate" && (
                  <div className="absolute top-3 right-3 text-blue-500">
                    <CheckCircle2 className="size-4.5 fill-blue-500 text-background" />
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Code2 className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Candidate Persona</h3>
                    <p className="text-[11px] text-muted-foreground">Practice & Assessments</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Browse public project architectures, save bookmarks, join sessions with invite codes, and track preparation.
                </p>
                <div className="mt-3 pt-3 border-t border-border/60 flex justify-end">
                  {role === "candidate" ? (
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Current Role</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 gap-1 border-blue-500/40 text-blue-600 dark:text-blue-400"
                      disabled={switchingTo === "candidate"}
                    >
                      {switchingTo === "candidate" ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          <span>Switching...</span>
                        </>
                      ) : (
                        <span>Switch to Candidate</span>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Assessor Option */}
              <div
                onClick={() => handleSwitch("assessor")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                  role === "assessor"
                    ? "border-amber-500 bg-amber-500/5 shadow-xs"
                    : "border-border hover:border-muted-foreground/40 bg-card"
                }`}
              >
                {role === "assessor" && (
                  <div className="absolute top-3 right-3 text-amber-500">
                    <CheckCircle2 className="size-4.5 fill-amber-500 text-background" />
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Assessor Persona</h3>
                    <p className="text-[11px] text-muted-foreground">Creation & Evaluation</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Create public or private software projects, configure 7–30 day expiration windows, generate share links, and view analytics.
                </p>
                <div className="mt-3 pt-3 border-t border-border/60 flex justify-end">
                  {role === "assessor" ? (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Current Role</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400"
                      disabled={switchingTo === "assessor"}
                    >
                      {switchingTo === "assessor" ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          <span>Switching...</span>
                        </>
                      ) : (
                        <span>Switch to Assessor</span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Existing settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Account & Authentication</CardTitle>
            <CardDescription className="text-xs">
              Authentication is managed through Clerk. Identity verification occurs server-side.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>Session tokens, multi-factor authentication, and profile credentials are securely verified on every API call.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Environment Security Policy</CardTitle>
            <CardDescription className="text-xs">
              Ephemeral environment sandbox restrictions and compute limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>Containers are provisioned only when interview sessions start and destroyed immediately upon expiration.</p>
          </CardContent>
        </Card>
      </div>

      {/* First-Time Assessor Activation Dialog */}
      <AssessorActivationModal
        open={isActivationModalOpen}
        onOpenChange={setIsActivationModalOpen}
      />
    </div>
  )
}
