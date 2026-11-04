import type { BaseEntity } from "@/types/common.types"

export type SessionLifecycleState =
  | "draft"
  | "ready"
  | "waiting"
  | "provisioning"
  | "active"
  | "paused"
  | "submitting"
  | "completed"
  | "expired"
  | "failed"
  | "cleaning_up"
  | "destroyed"

export interface SessionTimer {
  startedAt?: string
  expiresAt?: string
  durationMinutes: number
  remainingSeconds: number
  isPaused: boolean
}

export interface SessionParticipant {
  id: string
  userId: string
  name: string
  email: string
  role: "participant" | "interviewer" | "observer"
  joinedAt?: string
}

export interface Session extends BaseEntity {
  name: string
  projectId: string
  challengeId: string
  creatorId: string
  inviteCode: string
  state: SessionLifecycleState
  timer: SessionTimer
  participants: SessionParticipant[]
}

export interface CreateSessionDto {
  name: string
  projectId: string
  challengeId: string
  durationMinutes: number
}
