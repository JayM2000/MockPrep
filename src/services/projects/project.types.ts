import type { BaseEntity } from "@/types/common.types"

export type ProjectStatus =
  | "draft"
  | "submitting"
  | "queued"
  | "generating"
  | "validating"
  | "ready"
  | "failed"

export type ProjectComplexity = "beginner" | "intermediate" | "advanced"

export interface Project extends BaseEntity {
  name: string
  description: string
  category: string
  frontendTech: string
  backendTech: string
  database: string
  complexity: ProjectComplexity
  status: ProjectStatus
  ownerId: string
  tags: string[]
}

export interface CreateProjectDto {
  name: string
  description: string
  category: string
  frontendTech: string
  backendTech: string
  database: string
  complexity: ProjectComplexity
  generationNotes?: string
}

export interface UpdateProjectDto {
  name?: string
  description?: string
  tags?: string[]
}
