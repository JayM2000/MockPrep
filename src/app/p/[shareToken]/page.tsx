import { Suspense } from "react"
import { BrandLogo } from "@/components/shared/brand-logo"
import { Skeleton } from "@/components/ui/skeleton"
import { SharedProjectView } from "./shared-project-view"

interface SharedProjectPageProps {
  params: Promise<{ shareToken: string }>
}

async function SharedProjectContent({ params }: SharedProjectPageProps) {
  const { shareToken } = await params
  return <SharedProjectView shareToken={shareToken} />
}

function SharedProjectFallback() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <BrandLogo />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export default function SharedProjectPage({ params }: SharedProjectPageProps) {
  return (
    <Suspense fallback={<SharedProjectFallback />}>
      <SharedProjectContent params={params} />
    </Suspense>
  )
}
