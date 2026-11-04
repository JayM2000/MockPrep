import rawProjects from "@/mocks/fixtures/projects.json"
import type {
  Project,
  ProjectFilters,
  CreateProjectDto,
  UpdateProjectDto,
} from "./project.types"

// In-memory mock store initialized from fixtures
let mockProjects: Project[] = [...(rawProjects as Project[])]

const SIMULATED_LATENCY_MS = 180

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const projectService = {
  /**
   * Fetches projects with optional client-side search, filtering, and sorting.
   */
  async listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    await delay(SIMULATED_LATENCY_MS)

    let results = [...mockProjects]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (filters.status && filters.status !== "all") {
      results = results.filter((p) => p.status === filters.status)
    }

    if (filters.complexity && filters.complexity !== "all") {
      results = results.filter((p) => p.complexity === filters.complexity)
    }

    const sortBy = filters.sortBy ?? "updatedAt"
    const order = filters.sortOrder ?? "desc"

    results.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      }
      return order === "desc" ? -comparison : comparison
    })

    return results
  },

  /**
   * Retrieves a single project by ID.
   */
  async getProjectById(id: string): Promise<Project | null> {
    await delay(SIMULATED_LATENCY_MS)
    const project = mockProjects.find((p) => p.id === id)
    return project ? { ...project } : null
  },

  /**
   * Creates a new simulated project in the mock store.
   */
  async createProject(dto: CreateProjectDto): Promise<Project> {
    await delay(SIMULATED_LATENCY_MS + 200)

    const now = new Date().toISOString()
    const newProject: Project = {
      id: `proj-${Date.now().toString(36)}`,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      frontendTech: dto.frontendTech,
      backendTech: dto.backendTech,
      database: dto.database,
      complexity: dto.complexity,
      status: "ready", // Confirmed ready state
      ownerId: "user_current",
      tags: dto.tags && dto.tags.length > 0 ? dto.tags : [dto.category],
      createdAt: now,
      updatedAt: now,
    }

    mockProjects.unshift(newProject)
    return { ...newProject }
  },

  /**
   * Updates an existing project.
   */
  async updateProject(id: string, dto: UpdateProjectDto): Promise<Project | null> {
    await delay(SIMULATED_LATENCY_MS)
    const index = mockProjects.findIndex((p) => p.id === id)
    if (index === -1) return null

    mockProjects[index] = {
      ...mockProjects[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    }
    return { ...mockProjects[index] }
  },

  /**
   * Deletes a project from the mock store.
   */
  async deleteProject(id: string): Promise<boolean> {
    await delay(SIMULATED_LATENCY_MS)
    const initialLen = mockProjects.length
    mockProjects = mockProjects.filter((p) => p.id !== id)
    return mockProjects.length < initialLen
  },
}
