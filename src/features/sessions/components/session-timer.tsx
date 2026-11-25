"use client"

import * as React from "react"
import { Clock, AlertTriangle } from "lucide-react"
import type { SessionStatus } from "@/types/session.types"

interface SessionTimerProps {
  startedAt?: string | null
  durationMins: number
  status: SessionStatus
  className?: string
  showLabel?: boolean
}

function formatRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00"
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, "0")

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

export function SessionTimer({
  startedAt,
  durationMins,
  status,
  className,
  showLabel = true,
}: SessionTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (status !== "in_progress" || !startedAt) {
      setRemainingSeconds(null)
      return
    }

    const startTime = new Date(startedAt).getTime()
    const targetEndTime = startTime + durationMins * 60 * 1000

    const updateTimer = () => {
      const now = Date.now()
      const diffSec = Math.max(0, Math.floor((targetEndTime - now) / 1000))
      setRemainingSeconds(diffSec)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [startedAt, durationMins, status])

  if (status === "ready") {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className || ""}`}>
        <Clock className="size-3.5 text-muted-foreground/80" />
        {showLabel && <span>Allocation:</span>}
        <span className="font-mono font-medium text-foreground">{durationMins} mins</span>
      </div>
    )
  }

  if (status === "completed") {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className || ""}`}>
        <Clock className="size-3.5 text-muted-foreground/80" />
        {showLabel && <span>Duration:</span>}
        <span className="font-mono font-medium text-foreground">{durationMins} mins (Submitted)</span>
      </div>
    )
  }

  if (status === "expired" || (remainingSeconds !== null && remainingSeconds <= 0)) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-destructive font-medium ${className || ""}`}>
        <AlertTriangle className="size-3.5" />
        <span>Time Expired</span>
      </div>
    )
  }

  if (remainingSeconds === null) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className || ""}`}>
        <Clock className="size-3.5 animate-spin" />
        <span>Calculating...</span>
      </div>
    )
  }

  const isLowTime = remainingSeconds < 15 * 60 // under 15 minutes

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border ${
        isLowTime
          ? "border-destructive/40 bg-destructive/10 text-destructive animate-pulse"
          : "border-primary/30 bg-primary/10 text-primary"
      } ${className || ""}`}
    >
      <Clock className="size-3.5" />
      {showLabel && <span className="font-sans font-normal text-muted-foreground mr-1">Time Left:</span>}
      <span>{formatRemaining(remainingSeconds)}</span>
    </div>
  )
}
