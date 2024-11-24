import { Suspense } from "react"
import { TeamsClient } from "@/components/teams/teams-client"
import { TeamsService } from "@/lib/services/teams"

export default async function TeamsPage() {
  const initialTeams = await TeamsService.getTeams()

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <TeamsClient initialTeams={initialTeams} />
      </Suspense>
    </div>
  )
}