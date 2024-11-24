import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { z } from "zod"

export const PracticePlanSchema = z.object({
  team_id: z.string().min(1, "Please select a team"),
  date: z.string(),
  duration: z.number().min(30, "Practice must be at least 30 minutes"),
  focus_areas: z.array(z.string()).min(1, "Select at least one focus area"),
  notes: z.string().optional(),
  drills: z.array(z.object({
    drill_id: z.string(),
    duration: z.number(),
    order: z.number(),
    notes: z.string().optional(),
  })),
})

export type PracticePlan = z.infer<typeof PracticePlanSchema> & {
  id: string
  created_by: string
  created_at: string
  team: {
    name: string
    level: string
  }
}

export type CreatePracticePlanInput = z.infer<typeof PracticePlanSchema>
export type UpdatePracticePlanInput = Partial<CreatePracticePlanInput>

export const focusAreaOptions = [
  "Hitting",
  "Fielding",
  "Pitching",
  "Base Running",
  "Team Defense",
  "Game Situations",
  "Conditioning",
] as const

export class PracticePlansService {
  // Server-side methods
  static async getPracticePlans(teamId?: string, startDate?: string, endDate?: string) {
    const supabase = createServerClient()
    let query = supabase
      .from("practice_plans")
      .select(`
        *,
        team:teams(name, level)
      `)
      .order("date", { ascending: true })

    if (teamId) {
      query = query.eq("team_id", teamId)
    }

    if (startDate) {
      query = query.gte("date", startDate)
    }

    if (endDate) {
      query = query.lte("date", endDate)
    }

    const { data, error } = await query
    if (error) throw error
    return data as PracticePlan[]
  }

  static async getPracticePlanById(id: string) {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("practice_plans")
      .select(`
        *,
        team:teams(name, level)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data as PracticePlan
  }

  // Client-side methods
  static async createPracticePlan(plan: CreatePracticePlanInput) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from("practice_plans")
      .insert([plan])
      .select(`
        *,
        team:teams(name, level)
      `)
      .single()

    if (error) throw error
    return data as PracticePlan
  }

  static async updatePracticePlan(id: string, plan: UpdatePracticePlanInput) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from("practice_plans")
      .update(plan)
      .eq("id", id)
      .select(`
        *,
        team:teams(name, level)
      `)
      .single()

    if (error) throw error
    return data as PracticePlan
  }

  static async deletePracticePlan(id: string) {
    const supabase = createBrowserClient()
    const { error } = await supabase
      .from("practice_plans")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // AI Plan Generation
  static async generatePracticePlan(input: {
    team_id: string
    date: string
    duration: number
    focus_areas: string[]
    previous_plans?: PracticePlan[]
  }) {
    // Here you would integrate with your AI service
    // For now, we'll return a simple template
    const drillsPerFocus = Math.floor(input.duration / (input.focus_areas.length * 15))
    
    const drills = input.focus_areas.flatMap((focus, focusIndex) => {
      return Array.from({ length: drillsPerFocus }, (_, index) => ({
        drill_id: `generated-${focus}-${index}`,
        duration: 15,
        order: focusIndex * drillsPerFocus + index,
        notes: `${focus} drill ${index + 1}`,
      }))
    })

    return {
      team_id: input.team_id,
      date: input.date,
      duration: input.duration,
      focus_areas: input.focus_areas,
      drills,
      notes: "AI-generated practice plan",
    }
  }
}