import Link from "next/link"
import { Plus, FolderGit2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Explore, create, and manage software projects for engineering challenges.
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <FolderGit2 className="mx-auto size-10 text-muted-foreground/60" />
        <h3 className="mt-4 text-base font-semibold">No projects yet</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          Get started by describing a software project or choosing a starter template.
        </p>
        <div className="mt-6">
          <Link href="/projects/new">
            <Button size="sm">Create First Project</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
