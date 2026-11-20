"use client"

import { useUserRole } from "@/context/user-role-context"
import { CandidateDashboard } from "@/components/dashboard/candidate-dashboard"
import { AssessorDashboard } from "@/components/dashboard/assessor-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { role, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (role === "assessor") {
    return <AssessorDashboard />
  }

  // Default to Candidate dashboard
  return <CandidateDashboard />
}
