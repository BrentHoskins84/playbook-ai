"use server"

import { createClient } from "@/lib/supabase/server"
import type { Team } from "./teams"

export async function getTeams(search?: string) {
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

export async function getTeamById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Team
}
