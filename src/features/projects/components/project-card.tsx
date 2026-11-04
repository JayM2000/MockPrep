import Link from "next/link"
import { ArrowRight, Calendar, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectStatusBadge } from "./project-status-badge"
import type { Project } from "@/services/projects/project.types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="flex flex-col justify-between hover:border-foreground/30 transition-colors">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{project.category}</span>
            <CardTitle className="text-base font-semibold leading-snug">
              <Link href={`/projects/${project.id}`} className="hover:underline">
                {project.name}
              </Link>
            </CardTitle>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal capitalize">
            {project.complexity}
          </Badge>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]" title={`${project.frontendTech} / ${project.backendTech}`}>
            <Layers className="size-3.5 shrink-0" />
            <span className="truncate">{project.backendTech.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="size-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="pt-1">
          <Link href={`/projects/${project.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full justify-between text-xs">
              <span>View Details</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
