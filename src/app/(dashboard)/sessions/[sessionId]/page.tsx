import { Suspense } from "react"
import { SessionWorkspaceView } from "@/features/sessions/components/session-workspace-view"
import { Skeleton } from "@/components/ui/skeleton"

interface SessionPageProps {
  params: Promise<{ sessionId: string }>
}

async function SessionContent({ params }: SessionPageProps) {
  const { sessionId } = await params
  return <SessionWorkspaceView sessionId={sessionId} />
}

function SessionFallback() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-72 md:col-span-2 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}

export default function SessionDetailPage({ params }: SessionPageProps) {
  return (
    <Suspense fallback={<SessionFallback />}>
      <SessionContent params={params} />
    </Suspense>
  )
}
