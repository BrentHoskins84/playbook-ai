"use client"

import { useState, useEffect } from "react"
import { TeamInfoModal } from "@/components/team-info-modal"
import { createClient } from "@/lib/supabase/client"

interface TeamInfoModalWrapperProps {
  teamId: string
  teamName: string
}

export function TeamInfoModalWrapper({ teamId, teamName }: TeamInfoModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(true)
  const supabase = createClient()

  const handleSubmit = async (data: { total_players: number; team_level: string }) => {

    console.log(data)

    const { error } = await supabase
      .from("teams")
      .update({
        total_players: data.total_players,
        team_level: data.team_level,
      })
      .eq("id", teamId)

    if (error) throw error
  }

  return (
    <TeamInfoModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
      teamName={teamName}
    />
  )
}
