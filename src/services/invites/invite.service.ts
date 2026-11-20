import { apiClient } from "@/lib/api/client"
import type {
  ProjectInvite,
  InviteReviewData,
  AcceptedSessionResult,
} from "@/types/invite.types"

export const inviteService = {
  /**
   * Sends email-bound single-use invites for a project.
   */
  async sendEmailInvites(
    projectId: string,
    emails: string[],
    message?: string,
    expiryDays: number = 7
  ): Promise<ProjectInvite[]> {
    return apiClient<ProjectInvite[]>(`/api/v1/projects/${projectId}/invites`, {
      method: "POST",
      body: JSON.stringify({ emails, message, expiryDays }),
    })
  },

  /**
   * Creates or rotates a generic public link for a public project.
   */
  async createOrRotatePublicLink(
    projectId: string,
    maxUses: number = 50,
    expiryDays: number = 14
  ): Promise<ProjectInvite> {
    return apiClient<ProjectInvite>(`/api/v1/projects/${projectId}/public-link`, {
      method: "POST",
      body: JSON.stringify({ maxUses, expiryDays }),
    })
  },

  /**
   * Disables the active public link for a project.
   */
  async disablePublicLink(projectId: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/api/v1/projects/${projectId}/public-link`, {
      method: "DELETE",
    })
  },

  /**
   * Retrieves all invites for a project.
   */
  async listProjectInvites(projectId: string): Promise<ProjectInvite[]> {
    return apiClient<ProjectInvite[]>(`/api/v1/projects/${projectId}/invites`)
  },

  /**
   * Resends an email invite with a refreshed token.
   */
  async resendInvite(inviteId: string): Promise<ProjectInvite> {
    return apiClient<ProjectInvite>(`/api/v1/invites/${inviteId}/resend`, {
      method: "POST",
    })
  },

  /**
   * Revokes an existing invite.
   */
  async revokeInvite(inviteId: string): Promise<ProjectInvite> {
    return apiClient<ProjectInvite>(`/api/v1/invites/${inviteId}/revoke`, {
      method: "POST",
    })
  },

  /**
   * Validates an invite token and fetches review-page data.
   */
  async validateInvite(token: string, email?: string): Promise<InviteReviewData> {
    const query = email ? `?email=${encodeURIComponent(email)}` : ""
    return apiClient<InviteReviewData>(`/api/v1/invites/validate/${token}${query}`)
  },

  /**
   * Accepts an invite and initializes a candidate assessment session.
   */
  async acceptInvite(
    token: string,
    candidateEmail?: string
  ): Promise<AcceptedSessionResult> {
    return apiClient<AcceptedSessionResult>(`/api/v1/invites/accept/${token}`, {
      method: "POST",
      body: JSON.stringify({ candidateEmail }),
    })
  },
}
