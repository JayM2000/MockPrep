import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Platform preferences, authentication profiles, and environment configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Account & Authentication</CardTitle>
            <CardDescription>
              Authentication is managed through Clerk. Identity verification occurs server-side.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Session management, multi-factor authentication, and profile credentials are securely delegated to Clerk.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Environment Security Policy</CardTitle>
            <CardDescription>
              Ephemeral environment sandbox restrictions and compute limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Containers are provisioned only when interview sessions start and destroyed immediately upon completion.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
