import Link from "next/link"
import { PlaySquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectSessionsTabProps {
  projectId: string
}

export function ProjectSessionsTab({ projectId }: ProjectSessionsTabProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <PlaySquare className="mx-auto size-10 text-muted-foreground/60" />
      <h3 className="mt-4 text-base font-semibold">No sessions created yet</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
        Sessions will appear here once you configure challenges and invite participants.
      </p>
      <div className="mt-6">
        <Link href={`/projects/${projectId}/sessions/new`}>
          <Button size="sm" variant="outline">
            Create Session
          </Button>
        </Link>
      </div>
    </div>
  )
}
