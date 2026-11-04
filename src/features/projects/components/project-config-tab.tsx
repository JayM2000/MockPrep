import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/services/projects/project.types"

interface ProjectConfigTabProps {
  project: Project
}

export function ProjectConfigTab({ project }: ProjectConfigTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Technical Stack & Environment Configuration</CardTitle>
        <CardDescription>Configured frameworks, runtimes, and databases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
          <div className="rounded-md border border-border p-3">
            <dt className="text-xs text-muted-foreground font-medium">Frontend Framework</dt>
            <dd className="mt-1 font-mono text-sm">{project.frontendTech}</dd>
          </div>
          <div className="rounded-md border border-border p-3">
            <dt className="text-xs text-muted-foreground font-medium">Backend Runtime / API</dt>
            <dd className="mt-1 font-mono text-sm">{project.backendTech}</dd>
          </div>
          <div className="rounded-md border border-border p-3">
            <dt className="text-xs text-muted-foreground font-medium">Primary Database</dt>
            <dd className="mt-1 font-mono text-sm">{project.database}</dd>
          </div>
          <div className="rounded-md border border-border p-3">
            <dt className="text-xs text-muted-foreground font-medium">Repository State</dt>
            <dd className="mt-1 font-mono text-sm capitalize">{project.status}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
