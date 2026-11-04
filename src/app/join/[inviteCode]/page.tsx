import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { Key } from "lucide-react"

interface InviteContentProps {
  params: Promise<{ inviteCode: string }>
}

async function InviteCard({ params }: InviteContentProps) {
  const { inviteCode } = await params
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <Key className="size-5" />
        </div>
        <CardTitle className="text-xl font-semibold">Invitation Verification</CardTitle>
        <CardDescription>
          Validating session code: <code className="font-mono text-foreground font-semibold">{inviteCode}</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-border p-4 text-center text-sm text-muted-foreground">
          Server-side validation verifies token validity, expiration, and participant permissions before workspace access.
        </div>
      </CardContent>
    </Card>
  )
}

function InviteLoadingFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <Key className="size-5" />
        </div>
        <CardTitle className="text-xl font-semibold">Invitation Verification</CardTitle>
        <CardDescription>Validating session token...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-border p-4 text-center text-sm text-muted-foreground">
          Checking invitation status...
        </div>
      </CardContent>
    </Card>
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
