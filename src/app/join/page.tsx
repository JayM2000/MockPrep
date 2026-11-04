import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { Key } from "lucide-react"

export default function JoinPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <Key className="size-5" />
            </div>
            <CardTitle className="text-xl font-semibold">Join a Session</CardTitle>
            <CardDescription>
              Enter the unique invitation code provided by your interviewer or instructor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border p-4 text-center text-sm text-muted-foreground">
              Direct code redemption and invitation validation will be enabled with session services in Milestone 4.
            </div>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  )
}
