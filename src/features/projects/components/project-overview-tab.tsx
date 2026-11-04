import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/services/projects/project.types"

interface ProjectOverviewTabProps {
  project: Project
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">About This Project</CardTitle>
          <CardDescription>Scope and architecture summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground self-center mr-2">Tags:</span>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{project.category}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Complexity Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold capitalize">{project.complexity}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Target Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{project.database}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
