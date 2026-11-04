/**
 * Centralized, type-safe Query Key Factory
 * Ensures consistent cache invalidation and query deduplication across features.
 */
export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  challenges: {
    all: ["challenges"] as const,
    lists: (projectId: string) =>
      [...queryKeys.challenges.all, "list", projectId] as const,
    detail: (projectId: string, challengeId: string) =>
      [...queryKeys.challenges.all, "detail", projectId, challengeId] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    lists: () => [...queryKeys.sessions.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.sessions.lists(), filters] as const,
    details: () => [...queryKeys.sessions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.sessions.details(), id] as const,
  },
  user: {
    current: ["user", "current"] as const,
    profile: (userId: string) => ["user", "profile", userId] as const,
  },
} as const
