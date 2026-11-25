import { Suspense } from "react"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { JoinSessionCard } from "@/features/sessions/components/join-session-card"
import { Skeleton } from "@/components/ui/skeleton"

interface InviteContentProps {
  params: Promise<{ inviteCode: string }>
}

async function InviteCard({ params }: InviteContentProps) {
  const { inviteCode } = await params
  return <JoinSessionCard initialCode={inviteCode} />
}

function InviteLoadingFallback() {
  return (
    <div className="w-full max-w-md p-6 rounded-xl border border-border bg-card space-y-4">
      <Skeleton className="h-10 w-10 rounded-full mx-auto" />
      <Skeleton className="h-6 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default function JoinInvitePage({ params }: InviteContentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Suspense fallback={<InviteLoadingFallback />}>
          <InviteCard params={params} />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}
