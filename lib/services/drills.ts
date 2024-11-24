import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { z } from "zod"

export const DrillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  skill_focus: z.string().min(1, "Please select a skill focus"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  skill_level: z.string().optional(),
  equipment: z.string().optional(),
})

export type Drill = z.infer<typeof DrillSchema> & {
  id: string
  created_by: string
  created_at: string
}

export type CreateDrillInput = z.infer<typeof DrillSchema>
export type UpdateDrillInput = Partial<CreateDrillInput>

export const skillFocusOptions = [
  "Fielding",
  "Batting",
  "Pitching",
  "Baserunning",
  "Catching",
  "Conditioning",
] as const

export const skillLevelOptions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
] as const

export class DrillsService {
  // Server-side methods
  static async getDrills(search?: string, skillFocus?: string) {
    const supabase = createServerClient()
    let query = supabase
      .from("drills")
      .select("*")
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (skillFocus) {
      query = query.eq("skill_focus", skillFocus)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Drill[]
  }

  static async getDrillById(id: string) {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("drills")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data as Drill
  }

  // Client-side methods
  static async createDrill(drill: CreateDrillInput) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from("drills")
      .insert([drill])
      .select()
      .single()

    if (error) throw error
    return data as Drill
  }

  static async updateDrill(id: string, drill: UpdateDrillInput) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from("drills")
      .update(drill)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Drill
  }

  static async deleteDrill(id: string) {
    const supabase = createBrowserClient()
    const { error } = await supabase
      .from("drills")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Search and filter methods
  static async searchDrills(search: string, skillFocus?: string) {
    const supabase = createBrowserClient()
    let query = supabase
      .from("drills")
      .select("*")
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (skillFocus) {
      query = query.eq("skill_focus", skillFocus)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Drill[]
  }
}