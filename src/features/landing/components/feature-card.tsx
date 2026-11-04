import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlatformFeature } from "../types/landing.types"

interface FeatureCardProps {
  feature: PlatformFeature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Icon className="size-5" />
          <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
        </div>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{feature.details}</p>
      </CardContent>
    </Card>
  )
}
