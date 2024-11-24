"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TeamCard } from "@/components/teams/team-card"
import { Input } from "@/components/ui/input"
import { TeamsService, type Team } from "@/lib/services/teams"

interface TeamsListProps {
  initialTeams: Team[]
}

export function TeamsList({ initialTeams }: TeamsListProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const data = await TeamsService.searchTeams(search)
        setTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [search])

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search teams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div>Loading teams...</div>
      ) : teams.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No teams found. Create your first team to get started!
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onTeamUpdated={async () => {
                const updatedTeams = await TeamsService.searchTeams(search)
                setTeams(updatedTeams)
              }} 
            />
          ))}
        </div>
      )}
    </div>
  )
}