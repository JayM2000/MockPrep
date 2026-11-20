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
export type ProjectVisibility = "public" | "private"

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
  visibility: ProjectVisibility
  shareToken?: string
  expiryDays: number
  expiresAt: string
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
  tags?: string[]
  visibility?: ProjectVisibility
  expiryDays?: number
}

export interface UpdateProjectDto {
  name?: string
  description?: string
  tags?: string[]
  status?: ProjectStatus
  visibility?: ProjectVisibility
}

export interface ProjectBookmark {
  id: string
  projectId: string
  createdAt: string
}

export interface ProjectFilters {
  search?: string
  status?: ProjectStatus | "all"
  category?: string
  complexity?: ProjectComplexity | "all"
  visibility?: ProjectVisibility | "all"
  sortBy?: "updatedAt" | "name" | "createdAt" | "expiresAt"
  sortOrder?: "asc" | "desc"
}
