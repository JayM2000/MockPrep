import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/query-keys"
import { projectService } from "./project.service"
import type { CreateProjectDto } from "./project.types"

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateProjectDto) => projectService.createProject(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useRenewProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, expiryDays }: { id: string; expiryDays: number }) =>
      projectService.renewProject(id, expiryDays),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.id) })
    },
  })
}

export function useBookmarkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => projectService.bookmarkProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.bookmarks() })
    },
  })
}

export function useRemoveBookmarkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => projectService.removeBookmark(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.bookmarks() })
    },
  })
}
