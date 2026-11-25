import { io, Socket } from "socket.io-client"

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:4000"

let socketInstance: Socket | null = null

/**
 * Returns a singleton Socket.IO client instance.
 * Lazily initialized on the client side only (safe from SSR execution).
 */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null
  }

  if (!socketInstance) {
    socketInstance = io(SOCKET_SERVER_URL, {
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    })
  }

  return socketInstance
}
