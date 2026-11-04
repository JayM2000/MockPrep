import { Suspense } from "react"
import { ProjectDetailView } from "@/features/projects/components/project-detail-view"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>
}

async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { projectId } = await params
  return <ProjectDetailView projectId={projectId} />
}

function ProjectDetailFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Suspense fallback={<ProjectDetailFallback />}>
      <ProjectDetailContent params={params} />
    </Suspense>
  )
}
