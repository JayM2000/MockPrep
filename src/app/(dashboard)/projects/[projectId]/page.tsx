"use client"

import { use } from "react"
import { ProjectDetailView } from "@/features/projects/components/project-detail-view"

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = use(params)

  return <ProjectDetailView projectId={projectId} />
}
