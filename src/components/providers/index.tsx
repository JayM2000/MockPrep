"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { UserRoleProvider } from "@/context/user-role-context"
import { SocketProvider } from "@/context/socket-context"

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
        <SocketProvider>
          <UserRoleProvider>
            {children}
          </UserRoleProvider>
        </SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
