"use client"

import Link from "next/link"
import { BarChart3, Globe, Lock, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/services/projects/project.queries"
import { useUserRole } from "@/context/user-role-context"
import { useCurrentTime } from "@/hooks/use-current-time"

export default function AnalyticsPage() {
  const { isCandidate } = useUserRole()
  const { data: projects } = useProjects()
  const now = useCurrentTime()

  if (isCandidate) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <CardTitle className="text-base font-semibold">Assessor Access Only</CardTitle>
        <CardDescription className="text-xs mt-1">
          Analytics dashboards are currently restricted to Assessor accounts.
        </CardDescription>
        <div className="mt-4">
          <Link href="/dashboard">
            <Button size="sm" variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </Card>
    )
  }

  const allProjects = projects ?? []
  const total = allProjects.length
  const publicCount = allProjects.filter((p) => p.visibility === "public").length
  const privateCount = allProjects.filter((p) => p.visibility === "private").length

  const beginnerCount = allProjects.filter((p) => p.complexity === "beginner").length
  const intermediateCount = allProjects.filter((p) => p.complexity === "intermediate").length
  const advancedCount = allProjects.filter((p) => p.complexity === "advanced").length

  const activeCount = now ? allProjects.filter((p) => new Date(p.expiresAt).getTime() > now).length : total
  const expiredCount = total - activeCount

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="size-6 text-primary" />
          Assessor Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          High-level statistics and operational health of your assessment projects and environments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Active vs Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCount} <span className="text-sm font-normal text-muted-foreground">/ {expiredCount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{activeCount} links currently valid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Public Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total > 0 ? Math.round((publicCount / total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">{publicCount} public challenges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Simulations Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Active evaluation containers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="size-4" />
              Complexity Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Breakdown of project difficulty tiers across your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Beginner</span>
                <span className="font-medium">{beginnerCount}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${total ? (beginnerCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Intermediate</span>
                <span className="font-medium">{intermediateCount}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${total ? (intermediateCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Advanced</span>
                <span className="font-medium">{advancedCount}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${total ? (advancedCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="size-4" />
              Visibility Status
            </CardTitle>
            <CardDescription className="text-xs">
              Project access permissions for candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Globe className="size-4 text-emerald-500" />
                <div className="text-xs">
                  <p className="font-medium">Public Catalog</p>
                  <p className="text-muted-foreground">Visible to all registered candidates in Discover</p>
                </div>
              </div>
              <span className="font-bold text-sm">{publicCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Lock className="size-4 text-muted-foreground" />
                <div className="text-xs">
                  <p className="font-medium">Private / Link-Only</p>
                  <p className="text-muted-foreground">Only accessible via secret share tokens</p>
                </div>
              </div>
              <span className="font-bold text-sm">{privateCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
