import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, AlertCircle, PlayCircle } from "lucide-react"
import type { SessionStatus } from "@/types/session.types"

interface SessionStatusBadgeProps {
  status: SessionStatus
  className?: string
}

export function SessionStatusBadge({ status, className }: SessionStatusBadgeProps) {
  switch (status) {
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className={`border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5 text-xs font-medium ${className || ""}`}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge
          variant="outline"
          className={`border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 gap-1.5 text-xs font-medium ${className || ""}`}
        >
          <CheckCircle2 className="size-3 text-blue-500" />
          Completed
        </Badge>
      )
    case "ready":
      return (
        <Badge
          variant="outline"
          className={`border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5 text-xs font-medium ${className || ""}`}
        >
          <PlayCircle className="size-3 text-amber-500" />
          Ready to Start
        </Badge>
      )
    case "expired":
      return (
        <Badge
          variant="outline"
          className={`border-destructive/40 bg-destructive/10 text-destructive gap-1.5 text-xs font-medium ${className || ""}`}
        >
          <AlertCircle className="size-3" />
          Expired
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={className}>
          <Clock className="size-3" />
          {status}
        </Badge>
      )
  }
}
