import { createClient } from "@/lib/supabase/client"
import { z } from "zod"

export const PracticePlanSchema = z.object({
  team_id: z.string().min(1, "Please select a team"),
  goals: z.string().optional(),
  start_time: z.string(),
  end_time: z.string(),
  generated_plan: z.object({
    drills: z.array(z.string())
  }).optional(),
  status: z.enum(["draft", "final"]).default("draft"),
})

export type PracticePlan = {
  id: string
  team_id: string
  goals?: string
  start_time: string
  end_time: string
  generated_plan?: {
    drills: string[]
  }
  status: "draft" | "final"
  last_modified: string
  created_at: string
  team: {
    id: string
    team_name: string
    team_level: string
  }
}

export type CreatePracticePlanInput = z.infer<typeof PracticePlanSchema>
export type UpdatePracticePlanInput = Partial<CreatePracticePlanInput>

export const focusAreaOptions = [
  "Fielding",
  "Batting",
  "Pitching",
  "Baserunning",
  "Catching",
  "Conditioning",
  "Team Defense",
  "Situational Play",
] as const

// Client-side methods
export const PracticePlansService = {
  async createPracticePlan(plan: CreatePracticePlanInput) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("practice_plans")
      .insert([plan])
      .select(`
        *,
        team:teams(id, team_name, team_level)
      `)
      .single()

    if (error) throw error
    return data as PracticePlan
  },

  async updatePracticePlan(id: string, plan: UpdatePracticePlanInput) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("practice_plans")
      .update(plan)
      .eq("id", id)
      .select(`
        *,
        team:teams(id, team_name, team_level)
      `)
      .single()

    if (error) throw error
    return data as PracticePlan
  },

  async deletePracticePlan(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("practice_plans")
      .delete()
      .eq("id", id)

    if (error) throw error
  },

  async getPracticePlans(teamId?: string, startDate?: string, endDate?: string) {
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
  },

  // AI Plan Generation
  async generatePracticePlan(input: {
    team_id: string
    start_time: string
    end_time: string
    goals?: string
  }) {
    // Here you would integrate with your AI service
    // For now, we'll return a simple template
    return {
      team_id: input.team_id,
      start_time: input.start_time,
      end_time: input.end_time,
      goals: input.goals,
      generated_plan: {
        drills: ["drill-1", "drill-2", "drill-3"] // Example drill IDs
      },
      status: "draft" as const
    }
  }
}
