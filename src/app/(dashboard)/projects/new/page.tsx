import { CreateProjectForm } from "@/features/projects/components/create-project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
        <p className="text-sm text-muted-foreground">
          Describe a software project for AI-powered challenge generation and assessment.
        </p>
      </div>

      <CreateProjectForm />
    </div>
  )
}
