import { PLATFORM_FEATURES } from "../data/features"
import { FeatureCard } from "./feature-card"

export function FeaturesGrid() {
  return (
    <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {PLATFORM_FEATURES.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  )
}
