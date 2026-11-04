"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BrandLogo } from "@/components/shared/brand-logo"
import { SidebarNav } from "./sidebar-nav"
import { SidebarFooter } from "./sidebar-footer"

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="size-4" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-72 p-0 flex flex-col h-full bg-sidebar">
        {/* Pinned Mobile Header */}
        <SheetHeader className="h-14 shrink-0 px-4 flex flex-row items-center border-b border-sidebar-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <BrandLogo href="/dashboard" />
        </SheetHeader>

        {/* Independently Scrollable Navigation Container */}
        <div className="flex-1 min-h-0 overflow-y-auto py-4">
          <React.Suspense fallback={null}>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </React.Suspense>
        </div>

        {/* Pinned Engine Info Footer */}
        <SidebarFooter />
      </SheetContent>
    </Sheet>
  )
}
