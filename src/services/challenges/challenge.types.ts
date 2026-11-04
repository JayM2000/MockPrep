import type { BaseEntity } from "@/types/common.types"

export type ChallengeType =
  | "bug_fixing"
  | "feature_implementation"
  | "refactoring"
  | "performance"
  | "security"
  | "code_comprehension"

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "professional"

export type ChallengeSeverity = "low" | "medium" | "high" | "critical"

export interface AIPermissions {
  allowed: boolean
  allowCodeCompletion: boolean
  allowChatExplanation: boolean
  allowCodeGeneration: boolean
  maxPromptTokens?: number
}

export interface Challenge extends BaseEntity {
  projectId: string
  title: string
  taskDescription: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  severity: ChallengeSeverity
  acceptanceCriteria: string[]
  timeLimitMinutes: number
  aiPermissions: AIPermissions
  allowedTools: string[]
}

export interface CreateChallengeDto {
  projectId: string
  title: string
  taskDescription: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  severity: ChallengeSeverity
  acceptanceCriteria: string[]
  timeLimitMinutes: number
  aiPermissions: AIPermissions
  allowedTools?: string[]
}
