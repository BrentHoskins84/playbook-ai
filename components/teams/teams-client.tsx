"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeamsList } from "@/components/teams/teams-list"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import type { Team } from "@/lib/services/teams"

interface TeamsClientProps {
  initialTeams: Team[]
}

export function TeamsClient({ initialTeams }: TeamsClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      <TeamsList initialTeams={initialTeams} />
      <CreateTeamDialog open={open} onOpenChange={setOpen} />
    </>
  )
}