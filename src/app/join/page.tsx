import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { JoinSessionCard } from "@/features/sessions/components/join-session-card"

export default function JoinPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <JoinSessionCard />
      </main>
      <PublicFooter />
    </div>
  )
}
