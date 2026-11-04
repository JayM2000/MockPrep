import { CheckCircle2, Loader2, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProjectStatus } from "@/services/projects/project.types"

interface ProjectGenerationStatusProps {
  status: ProjectStatus
  projectName: string
}

const GENERATION_STEPS: { key: ProjectStatus; label: string; desc: string }[] = [
  { key: "submitting", label: "Submitting", desc: "Verifying project specification and schemas" },
  { key: "queued", label: "Queued", desc: "Waiting for project generation worker assignment" },
  { key: "generating", label: "Generating", desc: "Synthesizing full-stack repository structure" },
  { key: "validating", label: "Validating", desc: "Running build check and dependency tree verification" },
  { key: "ready", label: "Ready", desc: "Project is ready for challenge injection and session launch" },
]

export function ProjectGenerationStatus({ status, projectName }: ProjectGenerationStatusProps) {
  const currentStepIndex = GENERATION_STEPS.findIndex((s) => s.key === status)
  const isFailed = status === "failed"

  return (
    <Card className="w-full max-w-xl mx-auto border-border">
      <CardHeader>
        <CardTitle className="text-lg">Project Generation Status</CardTitle>
        <CardDescription>
          Processing repository setup for: <span className="font-semibold text-foreground">{projectName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFailed ? (
          <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <AlertTriangle className="size-5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Generation Failed.</span> An issue occurred during project synthesis. Please retry.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {GENERATION_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex || status === "ready"
              const isCurrent = idx === currentStepIndex && status !== "ready"

              return (
                <div
                  key={step.key}
                  className={`flex items-start gap-3 p-2.5 rounded-md border transition-colors ${
                    isCurrent
                      ? "border-primary/50 bg-primary/5"
                      : isPast
                      ? "border-border bg-muted/20"
                      : "border-transparent text-muted-foreground/50"
                  }`}
                >
                  <div className="mt-0.5">
                    {isPast ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="size-4 text-primary animate-spin" />
                    ) : (
                      <Clock className="size-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="text-xs">
                    <p className={`font-medium ${isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-muted-foreground/80">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
