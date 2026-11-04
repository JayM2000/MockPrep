import Link from "next/link"
import { Plus, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectChallengesTabProps {
  projectId: string
}

export function ProjectChallengesTab({ projectId }: ProjectChallengesTabProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <Cpu className="mx-auto size-10 text-muted-foreground/60" />
      <h3 className="mt-4 text-base font-semibold">No challenges configured yet</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
        Introduce intentional bugs, missing features, performance bottlenecks, or security audits to evaluate candidates.
      </p>
      <div className="mt-6">
        <Link href={`/projects/${projectId}/challenges/new`}>
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            Configure Challenge
          </Button>
        </Link>
      </div>
    </div>
  )
}
