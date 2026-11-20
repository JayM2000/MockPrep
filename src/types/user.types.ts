export type UserRole = "candidate" | "assessor"

export interface UserProfile {
  clerkUserId: string
  role: UserRole | null
  displayName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  isAssessorRegistered: boolean
  organization?: string | null
  title?: string | null
  evaluationTrack?: string | null
  targetLevel?: string | null
  websiteOrLinkedin?: string | null
  createdAt?: string
  updatedAt?: string
}
