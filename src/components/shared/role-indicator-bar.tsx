"use client"

import * as React from "react"
import { useUserRole } from "@/context/user-role-context"

export function RoleIndicatorBar() {
  const { role, isLoading } = useUserRole()

  if (isLoading || !role) {
    return null
  }

  const isAssessor = role === "assessor"

  return (
    <>
      {/* 1. Animated Top Edge Shimmering Light Bar */}
      <div
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 h-[3px] z-50 transition-all duration-500 ${
          isAssessor
            ? "bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-[0_0_16px_rgba(245,158,11,0.8)]"
            : "bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 shadow-[0_0_16px_rgba(59,130,246,0.8)]"
        }`}
      />

      {/* 2. Ambient Atmospheric Background Glow (Top Centered Aura) */}
      <div
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 h-64 pointer-events-none z-0 transition-opacity duration-700 opacity-60 ${
          isAssessor
            ? "bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,rgba(245,158,11,0.12),transparent_70%)]"
            : "bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,rgba(59,130,246,0.12),transparent_70%)]"
        }`}
      />
    </>
  )
}
