export type SessionStatus = "ready" | "in_progress" | "completed" | "expired"

export interface SessionProject {
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

export interface SessionAssessor {
  id: string
  name?: string | null
  organization?: string | null
  title?: string | null
}

export interface AssessmentSession {
  id: string
  inviteId?: string | null
  candidateId: string
  candidateEmail?: string | null
  projectId: string
  environmentId?: string | null
  status: SessionStatus
  startedAt?: string | null
  endsAt?: string | null
  durationMins: number
  createdAt: string
  updatedAt: string
  project: SessionProject
  assessor: SessionAssessor
}

export interface JoinSessionPayload {
  code: string
  candidateEmail?: string
}
