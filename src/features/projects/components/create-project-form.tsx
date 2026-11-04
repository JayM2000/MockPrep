"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createProjectSchema, type CreateProjectInput } from "@/lib/validation/project.schema"
import { useCreateProjectMutation } from "@/services/projects/project.mutations"
import { ProjectGenerationStatus } from "./project-generation-status"
import type { ProjectStatus } from "@/services/projects/project.types"

export function CreateProjectForm() {
  const router = useRouter()
  const createMutation = useCreateProjectMutation()

  const [generationState, setGenerationState] = React.useState<ProjectStatus | null>(null)
  const [createdProjectId, setCreatedProjectId] = React.useState<string | null>(null)
  const [projectName, setProjectName] = React.useState("Untitled Project")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Full-Stack Web Application",
      frontendTech: "Next.js 15 (React 19, Tailwind CSS)",
      backendTech: "Node.js (TypeScript, REST)",
      database: "PostgreSQL 16",
      complexity: "intermediate",
      generationNotes: "",
      tags: "Web, Full-Stack",
    },
  })

  // Track project name for generation status display via controlled onChange
  // instead of react-hook-form's `watch()` which breaks React Compiler memoization.

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      setGenerationState("submitting")

      const tagList = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [data.category]

      // Step 1: Submit to mock service
      const project = await createMutation.mutateAsync({
        name: data.name,
        description: data.description,
        category: data.category,
        frontendTech: data.frontendTech,
        backendTech: data.backendTech,
        database: data.database,
        complexity: data.complexity,
        generationNotes: data.generationNotes,
        tags: tagList,
      })

      setCreatedProjectId(project.id)

      // Step 2: Simulate multi-state progression as per brief Section 10
      // submitting -> queued -> generating -> validating -> ready
      setGenerationState("queued")
      await new Promise((r) => setTimeout(r, 600))

      setGenerationState("generating")
      await new Promise((r) => setTimeout(r, 800))

      setGenerationState("validating")
      await new Promise((r) => setTimeout(r, 600))

      setGenerationState("ready")
      await new Promise((r) => setTimeout(r, 500))

      router.push(`/projects/${project.id}`)
    } catch {
      setGenerationState("failed")
    }
  }

  if (generationState) {
    return (
      <div className="space-y-6">
        <ProjectGenerationStatus status={generationState} projectName={projectName} />
        {generationState === "ready" && createdProjectId && (
          <div className="text-center">
            <Button size="sm" onClick={() => router.push(`/projects/${createdProjectId}`)}>
              Open Project Details
            </Button>
          </div>
        )}
        {generationState === "failed" && (
          <div className="text-center">
            <Button variant="outline" size="sm" onClick={() => setGenerationState(null)}>
              Back to Form
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Create New Project</CardTitle>
        <CardDescription>
          Specify architecture requirements and engineering stacks for your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Distributed Payment Gateway"
              {...register("name", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setProjectName(e.target.value || "Untitled Project"),
              })}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Project Description & Core Scope *</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Explain the application's domain, core business logic, and primary user interactions..."
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Complexity Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g. Fintech, Healthcare, E-Commerce"
                {...register("category")}
                aria-invalid={Boolean(errors.category)}
              />
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="complexity">Target Complexity *</Label>
              <select
                id="complexity"
                {...register("complexity")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="beginner">Beginner (Foundational concepts)</option>
                <option value="intermediate">Intermediate (Production features)</option>
                <option value="advanced">Advanced (High-scale, concurrency, security)</option>
              </select>
              {errors.complexity && (
                <p className="text-xs text-destructive">{errors.complexity.message}</p>
              )}
            </div>
          </div>

          {/* Technology Stacks */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="frontendTech">Frontend *</Label>
              <Input
                id="frontendTech"
                placeholder="e.g. Next.js 15"
                {...register("frontendTech")}
                aria-invalid={Boolean(errors.frontendTech)}
              />
              {errors.frontendTech && (
                <p className="text-xs text-destructive">{errors.frontendTech.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="backendTech">Backend *</Label>
              <Input
                id="backendTech"
                placeholder="e.g. Node.js, FastAPI"
                {...register("backendTech")}
                aria-invalid={Boolean(errors.backendTech)}
              />
              {errors.backendTech && (
                <p className="text-xs text-destructive">{errors.backendTech.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="database">Database *</Label>
              <Input
                id="database"
                placeholder="e.g. PostgreSQL, Redis"
                {...register("database")}
                aria-invalid={Boolean(errors.database)}
              />
              {errors.database && (
                <p className="text-xs text-destructive">{errors.database.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (Comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g. Concurrency, Distributed, Auth"
              {...register("tags")}
            />
          </div>

          {/* Generation Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="generationNotes">Generation Notes (Optional)</Label>
            <Input
              id="generationNotes"
              placeholder="Optional hints or guidelines for synthetic project synthesis"
              {...register("generationNotes")}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/projects")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating Project..." : "Create & Synthesize"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
