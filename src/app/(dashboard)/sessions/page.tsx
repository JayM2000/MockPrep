import Link from "next/link"
import { PlaySquare, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage active, paused, and completed development sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/join">
            <Button variant="outline" size="sm" className="gap-2">
              <Key className="size-4" />
              Join via Code
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <PlaySquare className="mx-auto size-10 text-muted-foreground/60" />
        <h3 className="mt-4 text-base font-semibold">No active sessions</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          Sessions are provisioned dynamically when you invite candidates to solve challenge tasks.
        </p>
      </div>
    </div>
  )
}
