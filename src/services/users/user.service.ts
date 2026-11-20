import { apiClient } from "@/lib/api/client"
import type { UserProfile, UserRole } from "@/types/user.types"

export interface ActivateAssessorInput {
  organization: string
  title: string
  evaluationTrack?: string
  targetLevel?: string
  websiteOrLinkedin?: string
  bio?: string
}

export const userService = {
  /**
   * Retrieves current authenticated user profile and assigned role from Express backend.
   */
  async getMe(): Promise<UserProfile> {
    return apiClient<UserProfile>("/api/v1/users/me")
  },

  /**
   * Assigns or updates the role for the authenticated user.
   */
  async setRole(
    role: UserRole,
    displayName?: string,
    extra?: Partial<ActivateAssessorInput>
  ): Promise<UserProfile> {
    return apiClient<UserProfile>("/api/v1/users/role", {
      method: "POST",
      body: JSON.stringify({ role, displayName, ...extra }),
    })
  },

  /**
   * Explicitly activates the Assessor persona, capturing mandatory organization & professional title
   * plus optional extended evaluation track, candidate seniority, website/linkedin, and bio.
   */
  async activateAssessor(input: ActivateAssessorInput): Promise<UserProfile> {
    return apiClient<UserProfile>("/api/v1/users/activate-assessor", {
      method: "POST",
      body: JSON.stringify(input),
    })
  },
}
