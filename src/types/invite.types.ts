export type InviteType = "email" | "public_link"

export type InviteStatus =
  | "sent"
  | "opened"
  | "accepted"
  | "in_progress"
  | "completed"
  | "expired"
  | "revoked"

export interface ProjectInvite {
  id: string
  projectId: string
  createdBy: string
  rawTokenHint?: string | null
  type: InviteType
  email?: string | null
  message?: string | null
  maxUses: number
  useCount: number
  expiresAt: string
  revokedAt?: string | null
  status: InviteStatus
  createdAt: string
  updatedAt: string
  rawToken?: string
}

export interface InviteReviewData {
  invite: {
    id: string
    type: InviteType
    email?: string | null
    expiresAt: string
    maxUses: number
    useCount: number
    status: InviteStatus
    message?: string | null
  }
  project: {
    id: string
    name: string
    description?: string | null
    difficulty: string
    techStack: string[]
    category?: string | null
    visibility: "public" | "private"
    frontendTech?: string | null
    backendTech?: string | null
    databaseTech?: string | null
  }
  assessor: {
    name?: string | null
    organization?: string | null
    title?: string | null
  }
  isEmailMatch: boolean
}

export interface AcceptedSessionResult {
  sessionId: string
  projectId: string
  status: string
  startedAt?: string
  endsAt?: string
  durationMins: number
}
