import { Suspense } from "react"
import { SignIn } from "@clerk/nextjs"
import { BrandLogo } from "@/components/shared/brand-logo"

function SignInFallback() {
  return (
    <div className="w-[360px] h-[450px] rounded-lg border border-border bg-card p-6 flex flex-col items-center justify-center space-y-4">
      <div className="size-8 rounded-full bg-muted/40" />
      <div className="h-4 w-32 bg-muted/40 rounded" />
      <div className="h-9 w-full bg-muted/30 rounded" />
      <div className="h-9 w-full bg-muted/30 rounded" />
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="mb-6">
        <BrandLogo />
      </div>
      <Suspense fallback={<SignInFallback />}>
        <SignIn
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto shadow-none",
              card: "shadow-sm border border-border bg-card",
            },
          }}
        />
      </Suspense>
    </div>
  )
}
