import { z } from "zod"

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(80, "Project name cannot exceed 80 characters"),
  description: z
    .string()
    .min(10, "Please describe the project idea in at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.string().min(2, "Category is required"),
  frontendTech: z.string().min(2, "Frontend technology is required"),
  backendTech: z.string().min(2, "Backend technology is required"),
  database: z.string().min(2, "Database choice is required"),
  complexity: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select an engineering complexity",
  }),
  generationNotes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  tags: z.string().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const projectFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "draft", "submitting", "queued", "generating", "validating", "ready", "failed"]).optional(),
  complexity: z.enum(["all", "beginner", "intermediate", "advanced"]).optional(),
})

export type ProjectFilterInput = z.infer<typeof projectFilterSchema>
