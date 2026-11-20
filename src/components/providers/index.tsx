"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { UserRoleProvider } from "@/context/user-role-context"

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "purple"]}
    >
      <QueryProvider>
        <UserRoleProvider>
          {children}
        </UserRoleProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
