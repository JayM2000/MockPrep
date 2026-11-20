"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useUserRole } from "@/context/user-role-context"

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { role, isLoading } = useUserRole()

  React.useEffect(() => {
    if (!isLoading && !role) {
      router.replace("/onboarding")
    }
  }, [isLoading, role, router])

  return <>{children}</>
}
