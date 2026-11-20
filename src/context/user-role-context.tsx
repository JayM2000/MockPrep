"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService, ActivateAssessorInput } from "@/services/users/user.service"
import { queryKeys } from "@/lib/query/query-keys"
import type { UserProfile, UserRole } from "@/types/user.types"

interface UserRoleContextType {
  role: UserRole | null
  profile: UserProfile | null
  isLoading: boolean
  isCandidate: boolean
  isAssessor: boolean
  isAssessorRegistered: boolean
  setRole: (
    role: UserRole,
    displayName?: string,
    extra?: Partial<ActivateAssessorInput>
  ) => Promise<void>
  activateAssessor: (input: ActivateAssessorInput) => Promise<void>
  refresh: () => Promise<void>
}

const UserRoleContext = React.createContext<UserRoleContextType | undefined>(undefined)

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.user.current,
    queryFn: () => userService.getMe(),
    enabled: Boolean(isClerkLoaded && isSignedIn),
    staleTime: 5 * 60 * 1000,
  })

  const setRoleMutation = useMutation({
    mutationFn: ({
      role,
      displayName,
      extra,
    }: {
      role: UserRole
      displayName?: string
      extra?: { organization?: string; title?: string }
    }) => userService.setRole(role, displayName, extra),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.user.current, updatedProfile)
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })

  const activateAssessorMutation = useMutation({
    mutationFn: (input: ActivateAssessorInput) => userService.activateAssessor(input),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.user.current, updatedProfile)
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })

  const setRole = React.useCallback(
    async (
      role: UserRole,
      displayName?: string,
      extra?: { organization?: string; title?: string }
    ) => {
      await setRoleMutation.mutateAsync({ role, displayName, extra })
    },
    [setRoleMutation]
  )

  const activateAssessor = React.useCallback(
    async (input: ActivateAssessorInput) => {
      await activateAssessorMutation.mutateAsync(input)
    },
    [activateAssessorMutation]
  )

  const refresh = React.useCallback(async () => {
    await refetch()
  }, [refetch])

  const role = profile?.role ?? null
  const isCandidate = role === "candidate"
  const isAssessor = role === "assessor"
  const isAssessorRegistered = Boolean(profile?.isAssessorRegistered)
  const isLoading = !isClerkLoaded || (Boolean(isSignedIn) && isProfileLoading)

  const value = React.useMemo<UserRoleContextType>(
    () => ({
      role,
      profile: profile ?? null,
      isLoading,
      isCandidate,
      isAssessor,
      isAssessorRegistered,
      setRole,
      activateAssessor,
      refresh,
    }),
    [
      role,
      profile,
      isLoading,
      isCandidate,
      isAssessor,
      isAssessorRegistered,
      setRole,
      activateAssessor,
      refresh,
    ]
  )

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole(): UserRoleContextType {
  const context = React.useContext(UserRoleContext)
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider")
  }
  return context
}

export function useIsAssessor(): boolean {
  const { isAssessor } = useUserRole()
  return isAssessor
}

export function useIsCandidate(): boolean {
  const { isCandidate } = useUserRole()
  return isCandidate
}
