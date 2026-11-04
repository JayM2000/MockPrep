"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ProjectFiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") ?? ""
  const currentStatus = searchParams.get("status") ?? "all"
  const currentComplexity = searchParams.get("complexity") ?? "all"

  const [searchTerm, setSearchTerm] = React.useState(currentSearch)

  // Sync state if URL changes externally
  React.useEffect(() => {
    setSearchTerm(currentSearch)
  }, [currentSearch])

  const updateFilters = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchTerm.trim() || null })
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    updateFilters({ search: null })
  }

  const hasActiveFilters = currentSearch || currentStatus !== "all" || currentComplexity !== "all"

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by name, tag or stack..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-8 h-9 text-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={currentStatus}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          aria-label="Filter by Status"
        >
          <option value="all">All Statuses</option>
          <option value="ready">Ready</option>
          <option value="generating">Generating</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={currentComplexity}
          onChange={(e) => updateFilters({ complexity: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          aria-label="Filter by Complexity"
        >
          <option value="all">All Complexities</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              router.replace(pathname)
            }}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  )
}
