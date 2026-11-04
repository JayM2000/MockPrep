import { Code2, Cpu, Shield } from "lucide-react"
import type { PlatformFeature } from "../types/landing.types"

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: "realistic-projects",
    title: "Realistic Projects",
    description: "Full-stack project scaffolding across modern frameworks and databases.",
    details: "Generate synthetic codebases or import curated templates matching production environments.",
    icon: Code2,
  },
  {
    id: "configurable-challenges",
    title: "Configurable Challenges",
    description: "Inject bugs, performance hurdles, and feature requirements.",
    details: "Clearly separate difficulty and severity with strict server-side evaluation criteria.",
    icon: Cpu,
  },
  {
    id: "ai-governance",
    title: "AI Governance",
    description: "Fine-grained controls over allowed AI assistant features.",
    details: "Enforce tool permissions, audit code assistance, and isolate session execution contexts.",
    icon: Shield,
  },
]
