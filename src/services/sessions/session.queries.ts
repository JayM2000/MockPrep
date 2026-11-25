import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/query-keys"
import { sessionService } from "./session.service"
import type { JoinSessionPayload } from "@/types/session.types"

export function useSessions(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.sessions.list({ projectId }),
    queryFn: () => sessionService.listSessions(projectId),
  })
}

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => sessionService.getSessionById(sessionId),
    enabled: Boolean(sessionId),
  })
}

export function useJoinSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: JoinSessionPayload) => sessionService.joinSession(payload),
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      queryClient.setQueryData(queryKeys.sessions.detail(newSession.id), newSession)
    },
  })
}

export function useStartSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.startSession(sessionId),
    onSuccess: (updatedSession) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      queryClient.setQueryData(queryKeys.sessions.detail(updatedSession.id), updatedSession)
    },
  })
}

export function useCompleteSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.completeSession(sessionId),
    onSuccess: (updatedSession) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      queryClient.setQueryData(queryKeys.sessions.detail(updatedSession.id), updatedSession)
    },
  })
}
