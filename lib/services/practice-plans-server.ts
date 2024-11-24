import { createClient } from "@/lib/supabase/server"
import type { PracticePlan } from "./practice-plans"

export async function getPracticePlans(teamId?: string, startDate?: string, endDate?: string) {
  const supabase = createClient()
  let query = supabase
    .from("practice_plans")
    .select(`
      *,
      team:teams(id, team_name, team_level)
    `)
    .order("start_time", { ascending: true })

  if (teamId) {
    query = query.eq("team_id", teamId)
  }

  if (startDate) {
    query = query.gte("start_time", startDate)
  }

  if (endDate) {
    query = query.lte("end_time", endDate)
  }

  const { data, error } = await query
  if (error) throw error
  return data as PracticePlan[]
}

export async function getPracticePlanById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("practice_plans")
    .select(`
      *,
      team:teams(id, team_name, team_level)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data as PracticePlan
}
