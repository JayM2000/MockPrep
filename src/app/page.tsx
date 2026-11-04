import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { HeroSection } from "@/features/landing/components/hero-section"
import { FeaturesGrid } from "@/features/landing/components/features-grid"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <HeroSection />
          <FeaturesGrid />
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
