import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/query-keys"
import { projectService } from "./project.service"
import type { ProjectFilters } from "./project.types"

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: queryKeys.projects.list(filters as Record<string, unknown>),
    queryFn: () => projectService.listProjects(filters),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectService.getProjectById(id),
    enabled: Boolean(id),
  })
}

export function useBookmarks() {
  return useQuery({
    queryKey: queryKeys.projects.bookmarks(),
    queryFn: () => projectService.listBookmarks(),
  })
}

export function useSharedProject(token: string) {
  return useQuery({
    queryKey: queryKeys.projects.shared(token),
    queryFn: () => projectService.getSharedProject(token),
    enabled: Boolean(token),
    retry: false,
  })
}
