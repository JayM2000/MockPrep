import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@/services/projects/project.types"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  switch (status) {
    case "ready":
      return (
        <Badge variant="outline" className="border-emerald-600/30 text-emerald-600 bg-emerald-500/10 text-xs">
          Ready
        </Badge>
      )
    case "generating":
    case "validating":
    case "queued":
    case "submitting":
      return (
        <Badge variant="outline" className="border-amber-600/30 text-amber-600 bg-amber-500/10 text-xs">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="destructive" className="text-xs">
          Failed
        </Badge>
      )
    case "draft":
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          Draft
        </Badge>
      )
  }
}
