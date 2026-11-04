import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import { AppHeader } from "@/components/layout/header/app-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen h-dvh w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 min-w-0 flex-col h-full overflow-hidden">
        <AppHeader />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
