"use client"

import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants/site"

export function UserMenu() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="size-8 rounded-full bg-muted" />
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "size-8",
          },
        }}
      />
    )
  }

  return (
    <Link href={SITE_CONFIG.routes.signIn}>
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    </Link>
  )
}
