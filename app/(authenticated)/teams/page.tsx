import { AsyncBoundary } from "@/components/async-boundary"
import { TeamsClient } from "@/components/teams/teams-client"
import { getTeams } from "@/lib/services/teams-server"

export default async function TeamsPage() {
  const initialTeams = await getTeams()

  return (
    <div className="space-y-6">
      <AsyncBoundary>
        <TeamsClient initialTeams={initialTeams} />
      </AsyncBoundary>
    </div>
  )
}
