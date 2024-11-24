import { AsyncBoundary } from "@/components/async-boundary"
import { PracticePlansClient } from "@/components/practice-plans/practice-plans-client"
import { getPracticePlans } from "@/lib/services/practice-plans-server"
import { getTeams } from "@/lib/services/teams-server"

export default async function PracticePlansPage() {
  const [initialPlans, teams] = await Promise.all([
    getPracticePlans(),
    getTeams(),
  ])

  return (
    <div className="space-y-6">
      <AsyncBoundary>
        <PracticePlansClient initialPlans={initialPlans} teams={teams} />
      </AsyncBoundary>
    </div>
  )
}
