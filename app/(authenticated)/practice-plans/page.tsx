import { Suspense } from "react"
import { PracticePlansClient } from "@/components/practice-plans/practice-plans-client"
import { PracticePlansService } from "@/lib/services/practice-plans"
import { TeamsService } from "@/lib/services/teams"

export default async function PracticePlansPage() {
  const [initialPlans, teams] = await Promise.all([
    PracticePlansService.getPracticePlans(),
    TeamsService.getTeams(),
  ])

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <PracticePlansClient initialPlans={initialPlans} teams={teams} />
      </Suspense>
    </div>
  )
}