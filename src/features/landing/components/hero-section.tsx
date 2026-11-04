import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants/site"

export function HeroSection() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        Real-World Engineering Challenges & Interview Simulations
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
        Generate realistic software projects, introduce authentic engineering challenges,
        configure strict AI permissions, and evaluate engineering candidates in isolated sessions.
      </p>
      <div className="pt-2 flex flex-wrap gap-3">
        <Link href={SITE_CONFIG.routes.dashboard}>
          <Button size="lg" className="gap-2">
            Launch Platform <ArrowRight className="size-4" />
          </Button>
        </Link>
        <Link href={SITE_CONFIG.routes.signIn}>
          <Button variant="outline" size="lg">
            Join with Code
          </Button>
        </Link>
      </div>
    </div>
  )
}
