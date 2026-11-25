"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import { Socket } from "socket.io-client"
import { getSocket } from "@/lib/socket/socket-client"
import { queryKeys } from "@/lib/query/query-keys"

interface SocketContextValue {
  socket: Socket | null
  isConnected: boolean
  joinProjectRoom: (projectId: string) => void
  leaveProjectRoom: (projectId: string) => void
}

const SocketContext = React.createContext<SocketContextValue | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = React.useState(false)
  const { user, isSignedIn } = useUser()
  const queryClient = useQueryClient()
  const socketRef = React.useRef<Socket | null>(null)

  React.useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socketRef.current = socket

    const onConnect = () => {
      setIsConnected(true)
      if (isSignedIn && user?.id) {
        socket.emit("auth:identify", user.id)
      }
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    // Connect state listeners
    if (socket.connected) {
      onConnect()
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    // Real-Time Event Handlers -> Invalidate TanStack Query Caches

    // 1. Projects events (created, updated, deleted)
    const onProjectCreated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    }

    const onProjectUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    }

    const onProjectDeleted = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    }

    // 2. Invites events (created, revoked, accepted, public link toggled)
    const onInviteUpdated = (data?: { projectId?: string }) => {
      queryClient.invalidateQueries({ queryKey: ["project-invites"] })
      if (data?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["project-invites", data.projectId] })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    }

    // 3. Sessions events (joined, started, completed)
    const onSessionUpdated = (data?: { session?: { id?: string; projectId?: string } }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      if (data?.session?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(data.session.id) })
      }
      if (data?.session?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["project-invites", data.session.projectId] })
      }
    }

    // 4. Challenges events
    const onChallengeUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all })
    }

    // 5. Bookmarks events
    const onBookmarkUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.bookmarks() })
    }

    socket.on("project:created", onProjectCreated)
    socket.on("project:updated", onProjectUpdated)
    socket.on("project:deleted", onProjectDeleted)
    socket.on("invite:updated", onInviteUpdated)
    socket.on("session:updated", onSessionUpdated)
    socket.on("challenge:updated", onChallengeUpdated)
    socket.on("bookmark:updated", onBookmarkUpdated)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("project:created", onProjectCreated)
      socket.off("project:updated", onProjectUpdated)
      socket.off("project:deleted", onProjectDeleted)
      socket.off("invite:updated", onInviteUpdated)
      socket.off("session:updated", onSessionUpdated)
      socket.off("challenge:updated", onChallengeUpdated)
      socket.off("bookmark:updated", onBookmarkUpdated)
    }
  }, [queryClient, isSignedIn, user?.id])

  // Sync auth state if user signs in after initial socket connection
  React.useEffect(() => {
    const socket = socketRef.current
    if (socket && socket.connected && isSignedIn && user?.id) {
      socket.emit("auth:identify", user.id)
    }
  }, [isSignedIn, user?.id])

  const joinProjectRoom = React.useCallback((projectId: string) => {
    if (socketRef.current && projectId) {
      socketRef.current.emit("join:project", projectId)
    }
  }, [])

  const leaveProjectRoom = React.useCallback((projectId: string) => {
    if (socketRef.current && projectId) {
      socketRef.current.emit("leave:project", projectId)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      joinProjectRoom,
      leaveProjectRoom,
    }),
    [isConnected, joinProjectRoom, leaveProjectRoom]
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = React.useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

/**
 * Hook to automatically join a project room while a component (e.g. modal or detail view) is mounted.
 */
export function useProjectRoom(projectId: string | undefined) {
  const { joinProjectRoom, leaveProjectRoom } = useSocket()

  React.useEffect(() => {
    if (!projectId) return
    joinProjectRoom(projectId)
    return () => {
      leaveProjectRoom(projectId)
    }
  }, [projectId, joinProjectRoom, leaveProjectRoom])
}
