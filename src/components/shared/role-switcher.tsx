"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Code2, ShieldCheck, Loader2 } from "lucide-react"
import { useUserRole } from "@/context/user-role-context"
import { AssessorActivationModal } from "./assessor-activation-modal"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/user.types"

interface RoleSwitcherProps {
  variant?: "header" | "compact"
  className?: string
}

export function RoleSwitcher({ className }: RoleSwitcherProps) {
  const router = useRouter()
  const { role, setRole, isAssessorRegistered, isLoading } = useUserRole()
  const [switchingTarget, setSwitchingTarget] = React.useState<UserRole | null>(null)
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)

  if (isLoading || !role) {
    return null
  }

  const isAssessor = role === "assessor"
  const isCandidate = role === "candidate"

  const handleSelectRole = async (targetRole: UserRole) => {
    if (targetRole === role || switchingTarget) return

    // Approach 1: If switching to Assessor and not registered as Assessor yet, require activation
    if (targetRole === "assessor" && !isAssessorRegistered) {
      setIsActivationModalOpen(true)
      return
    }

    try {
      setSwitchingTarget(targetRole)
      await setRole(targetRole)

      const currentPath = typeof window !== "undefined" ? window.location.pathname : ""

      // Route guard redirections
      const assessorOnlyRoutes = ["/projects/new", "/analytics", "/links"]
      const candidateOnlyRoutes = ["/discover", "/bookmarks"]

      if (targetRole === "candidate" && assessorOnlyRoutes.some((r) => currentPath.startsWith(r))) {
        router.push("/dashboard")
      } else if (targetRole === "assessor" && candidateOnlyRoutes.some((r) => currentPath.startsWith(r))) {
        router.push("/dashboard")
      }
    } finally {
      setSwitchingTarget(null)
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center rounded-full p-0.5 border bg-muted/40 backdrop-blur-xs transition-all shadow-xs shrink-0",
          isAssessor ? "border-amber-500/30" : "border-blue-500/30",
          className
        )}
        role="group"
        aria-label="Workspace Role Switcher"
      >
        {/* Candidate Button */}
        <button
          type="button"
          onClick={() => handleSelectRole("candidate")}
          disabled={Boolean(switchingTarget)}
          className={cn(
            "relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 select-none cursor-pointer shrink-0",
            isCandidate
              ? "bg-blue-600 text-white shadow-xs font-semibold ring-1 ring-blue-400/40"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
          title={isCandidate ? "Candidate Mode Active" : "Click to switch to Candidate Mode"}
        >
          <Code2 className="size-3 sm:size-3.5 shrink-0" />
          <span>Candidate</span>
          {isCandidate && (
            <span className="relative flex size-1.5 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-cyan-100" />
            </span>
          )}
          {switchingTarget === "candidate" && (
            <Loader2 className="size-2.5 sm:size-3 animate-spin ml-1" />
          )}
        </button>

        {/* Assessor Button */}
        <button
          type="button"
          onClick={() => handleSelectRole("assessor")}
          disabled={Boolean(switchingTarget)}
          className={cn(
            "relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 select-none cursor-pointer shrink-0",
            isAssessor
              ? "bg-amber-600 text-white shadow-xs font-semibold ring-1 ring-amber-400/40"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
          title={
            isAssessor
              ? "Assessor Mode Active"
              : !isAssessorRegistered
              ? "Click to register and activate Assessor Workspace"
              : "Click to switch to Assessor Mode"
          }
        >
          <ShieldCheck className="size-3 sm:size-3.5 shrink-0" />
          <span>Assessor</span>
          {isAssessor && (
            <span className="relative flex size-1.5 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-amber-100" />
            </span>
          )}
          {switchingTarget === "assessor" && (
            <Loader2 className="size-2.5 sm:size-3 animate-spin ml-1" />
          )}
        </button>
      </div>

      {/* First-Time Assessor Activation Dialog */}
      <AssessorActivationModal
        open={isActivationModalOpen}
        onOpenChange={setIsActivationModalOpen}
      />
    </>
  )
}
