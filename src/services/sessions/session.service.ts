import { apiClient } from "@/lib/api/client"
import type { AssessmentSession, JoinSessionPayload } from "@/types/session.types"

export const sessionService = {
  /**
   * Lists sessions (Role-Aware: candidates get their attempts; assessors get attempts across their projects).
   */
  async listSessions(projectId?: string): Promise<AssessmentSession[]> {
    const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""
    return apiClient<AssessmentSession[]>(`/api/v1/sessions${query}`)
  },

  /**
   * Retrieves single session details by ID.
   */
  async getSessionById(sessionId: string): Promise<AssessmentSession> {
    return apiClient<AssessmentSession>(`/api/v1/sessions/${sessionId}`)
  },

  /**
   * Joins a session via invitation code / secret token.
   * Strictly for Candidates only.
   */
  async joinSession(payload: JoinSessionPayload): Promise<AssessmentSession> {
    return apiClient<AssessmentSession>("/api/v1/sessions/join", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  /**
   * Starts a candidate assessment session, activating the countdown timer.
   */
  async startSession(sessionId: string): Promise<AssessmentSession> {
    return apiClient<AssessmentSession>(`/api/v1/sessions/${sessionId}/start`, {
      method: "POST",
    })
  },

  /**
   * Completes a candidate assessment session and archives the submission.
   */
  async completeSession(sessionId: string): Promise<AssessmentSession> {
    return apiClient<AssessmentSession>(`/api/v1/sessions/${sessionId}/complete`, {
      method: "POST",
    })
  },
}
