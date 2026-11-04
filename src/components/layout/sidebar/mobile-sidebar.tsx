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
      <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar">
        <SheetHeader className="h-14 px-4 flex flex-row items-center border-b border-sidebar-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <BrandLogo href="/dashboard" />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
