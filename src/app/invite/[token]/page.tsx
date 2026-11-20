import { Suspense } from "react"
import { InviteReviewView } from "./invite-review-view"
import { Skeleton } from "@/components/ui/skeleton"

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto space-y-6 py-12 px-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <InviteReviewView />
    </Suspense>
  )
}
