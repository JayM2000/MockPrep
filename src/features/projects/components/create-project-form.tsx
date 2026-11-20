"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, Globe, Clock, ShieldAlert, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createProjectSchema, type CreateProjectInput } from "@/lib/validation/project.schema"
import { useCreateProjectMutation } from "@/services/projects/project.mutations"
import { useUserRole } from "@/context/user-role-context"

export function CreateProjectForm() {
  const router = useRouter()
  const { isCandidate, isLoading: isRoleLoading } = useUserRole()
  const createMutation = useCreateProjectMutation()

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      visibility: "private",
      expiryDays: 7,
    },
  })

  const currentVisibility = watch("visibility")
  const currentExpiryDays = watch("expiryDays")

  // Candidate Role Guard — candidates cannot create projects
  if (!isRoleLoading && isCandidate) {
    return (
      <Card className="max-w-xl mx-auto border-amber-500/30 bg-amber-500/5">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="size-6" />
          </div>
          <CardTitle className="text-lg">Assessor Access Required</CardTitle>
          <CardDescription className="text-xs">
            You are currently signed in with a <strong>Candidate</strong> account. Only Assessors can create and configure assessment projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="size-3.5" />
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/discover">
            <Button size="sm">
              Explore Public Projects
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      setErrorMessage(null)

      const tagList = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [data.category]

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
        visibility: data.visibility,
        expiryDays: Number(data.expiryDays) || 7,
      })

      // Project persisted in PostgreSQL — redirect to its detail page
      router.push(`/projects/${project.id}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create project. Please try again."
      )
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Create New Project</CardTitle>
        <CardDescription>
          Specify architecture requirements, target stack, visibility, and expiration window.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Distributed Payment Gateway"
              {...register("name")}
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

          {/* Visibility and Expiration Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-3.5 rounded-lg border border-border bg-muted/20">
            {/* Visibility Option */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Project Visibility *
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={currentVisibility === "private" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 gap-1.5 text-xs h-9"
                  onClick={() => setValue("visibility", "private")}
                >
                  <Lock className="size-3.5" />
                  Private
                </Button>
                <Button
                  type="button"
                  variant={currentVisibility === "public" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 gap-1.5 text-xs h-9"
                  onClick={() => setValue("visibility", "public")}
                >
                  <Globe className="size-3.5" />
                  Public
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {currentVisibility === "private"
                  ? "Only accessible to you and candidates with your secret share link."
                  : "Visible to all registered candidates in the Discover directory."}
              </p>
            </div>

            {/* Expiry Window */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiryDays" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Expiration Window *
                </Label>
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  {currentExpiryDays} days
                </span>
              </div>
              <input
                id="expiryDays"
                type="range"
                min={7}
                max={30}
                step={1}
                {...register("expiryDays", { valueAsNumber: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground leading-tight">
                Default is 7 days; max is 30 days. Projects auto-expire to keep environments clean.
              </p>
              {errors.expiryDays && (
                <p className="text-xs text-destructive">{errors.expiryDays.message}</p>
              )}
            </div>
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
              disabled={isSubmitting || createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              {createMutation.isPending ? "Creating Project..." : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
