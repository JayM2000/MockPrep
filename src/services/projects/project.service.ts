import { apiClient } from "@/lib/api/client"
import type {
  Project,
  ProjectFilters,
  CreateProjectDto,
  ProjectBookmark,
} from "./project.types"

/**
 * Project service — talks to the Express API at /api/v1/projects and /api/v1/shared.
 */
export const projectService = {
  /**
   * Fetches projects from Express, then applies client-side search/filter/sort.
   */
  async listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    let results = await apiClient<Project[]>("/api/v1/projects")

    // --- client-side search ---
    if (filters.search) {
      const q = filters.search.toLowerCase()
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // --- client-side status filter ---
    if (filters.status && filters.status !== "all") {
      results = results.filter((p) => p.status === filters.status)
    }

    // --- client-side complexity filter ---
    if (filters.complexity && filters.complexity !== "all") {
      results = results.filter((p) => p.complexity === filters.complexity)
    }

    // --- client-side visibility filter ---
    if (filters.visibility && filters.visibility !== "all") {
      results = results.filter((p) => p.visibility === filters.visibility)
    }

    // --- client-side sort ---
    const sortBy = filters.sortBy ?? "updatedAt"
    const order = filters.sortOrder ?? "desc"

    results.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "expiresAt") {
        comparison =
          new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
      } else {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      }
      return order === "desc" ? -comparison : comparison
    })

    return results
  },

  /**
   * Retrieves a single project by ID from Express.
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await apiClient<Project>(`/api/v1/projects/${encodeURIComponent(id)}`)
    } catch {
      return null
    }
  },

  /**
   * Creates a new project by POSTing to Express (Assessor only).
   */
  async createProject(dto: CreateProjectDto): Promise<Project> {
    return apiClient<Project>("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(dto),
    })
  },

  /**
   * Deletes a project via Express (Assessor only).
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      await apiClient<{ message: string }>(
        `/api/v1/projects/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      )
      return true
    } catch {
      return false
    }
  },

  /**
   * Extends a project's expiry (Assessor only).
   */
  async renewProject(id: string, expiryDays: number): Promise<Project> {
    return apiClient<Project>(`/api/v1/projects/${encodeURIComponent(id)}/renew`, {
      method: "PATCH",
      body: JSON.stringify({ expiryDays }),
    })
  },

  /**
   * Fetches a project via its unique share token (Candidate or Assessor).
   */
  async getSharedProject(shareToken: string): Promise<Project> {
    return apiClient<Project>(`/api/v1/shared/${encodeURIComponent(shareToken)}`)
  },

  /**
   * Adds a project bookmark for the current Candidate.
   */
  async bookmarkProject(projectId: string): Promise<ProjectBookmark> {
    return apiClient<ProjectBookmark>(
      `/api/v1/projects/${encodeURIComponent(projectId)}/bookmark`,
      { method: "POST" }
    )
  },

  /**
   * Removes a bookmark for the current Candidate.
   */
  async removeBookmark(projectId: string): Promise<void> {
    await apiClient(
      `/api/v1/projects/${encodeURIComponent(projectId)}/bookmark`,
      { method: "DELETE" }
    )
  },

  /**
   * Lists all bookmarks saved by the current Candidate.
   */
  async listBookmarks(): Promise<ProjectBookmark[]> {
    return apiClient<ProjectBookmark[]>("/api/v1/projects/bookmarks")
  },
}
