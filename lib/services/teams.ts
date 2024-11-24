import { createClient } from "@/lib/supabase/client"
import { z } from "zod"

export const TeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  level: z.string().min(1, "Please select a team level"),
  total_players: z.number().min(1, "Team must have at least 1 player"),
  practice_days: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export type Team = z.infer<typeof TeamSchema> & {
  id: string
  created_by: string
  created_at: string
}

export type CreateTeamInput = z.infer<typeof TeamSchema>
export type UpdateTeamInput = Partial<CreateTeamInput>

export const teamLevelOptions = [
  "Recreational",
  "Travel",
  "High School",
  "College",
] as const

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

// Client-side methods
export class TeamsService {
  static async createTeam(team: CreateTeamInput) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("teams")
      .insert([team])
      .select()
      .single()

    if (error) throw error
    return data as Team
  }

  static async updateTeam(id: string, team: UpdateTeamInput) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("teams")
      .update(team)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Team
  }

  static async deleteTeam(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Search method
  static async searchTeams(search: string) {
    const supabase = createClient()
    let query = supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Team[]
  }
}
