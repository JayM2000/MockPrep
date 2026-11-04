"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMounted } from "@/hooks"
import { THEME_OPTIONS } from "@/lib/constants/theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useIsMounted()

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Toggle theme">
        <Sun className="size-4" />
      </Button>
    )
  }

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="size-4" />
      case "purple":
        return <Palette className="size-4 text-primary" />
      default:
        return <Sun className="size-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Toggle theme">
            {renderIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
          >
            {option.value === "light" && <Sun className="mr-2 size-4" />}
            {option.value === "dark" && <Moon className="mr-2 size-4" />}
            {option.value === "purple" && <Palette className="mr-2 size-4" />}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
