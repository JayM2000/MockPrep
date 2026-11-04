"use client"

import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants/site"

export function PublicHeaderActions() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="h-8 w-20 bg-muted/40 rounded animate-pulse" />
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link href={SITE_CONFIG.routes.dashboard}>
          <Button size="sm" variant="default" className="gap-1.5">
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </Button>
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8",
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={SITE_CONFIG.routes.signIn}>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href={SITE_CONFIG.routes.signUp}>
        <Button size="sm">
          Get Started
        </Button>
      </Link>
    </div>
  )
}
