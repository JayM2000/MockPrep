import { HttpError, AppError } from "./errors"

/**
 * Base URL for the Express API backend.
 * NEXT_PUBLIC_ prefix makes it available in the browser bundle.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:4000"

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  token?: string
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, token, ...rest } = options

  // If endpoint is a relative path (starts with /), prepend the backend base URL.
  // Absolute URLs (http://...) are used as-is.
  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString
    }
  }

  // Resolve authorization token: explicitly passed > window.Clerk active session
  let authToken = token
  if (!authToken && typeof window !== "undefined") {
    try {
      const clerk = (
        window as unknown as {
          Clerk?: { session?: { getToken: () => Promise<string | null> } }
        }
      ).Clerk
      if (clerk?.session) {
        const sessionToken = await clerk.session.getToken()
        if (sessionToken) {
          authToken = sessionToken
        }
      }
    } catch {
      // Non-blocking if Clerk is initializing or in SSR
    }
  }

  const authHeader: Record<string, string> = {}
  if (authToken) {
    authHeader["Authorization"] = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...headers,
      },
      ...rest,
    })

    if (!response.ok) {
      let errorData: unknown
      try {
        errorData = await response.json()
      } catch {
        errorData = null
      }
      throw new HttpError(
        response.status,
        `Request failed with status ${response.status}`,
        errorData
      )
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(
      error instanceof Error ? error.message : "Network error occurred",
      "NETWORK_ERROR"
    )
  }
}
