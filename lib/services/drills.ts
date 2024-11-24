import { createClient } from "@/lib/supabase/client"
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
  static async getDrills(search?: string, skillFocus?: string) {
    try {
      const supabase = createClient()
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
    } catch (error) {
      console.error("Error fetching drills:", error)
      throw new Error("Failed to fetch drills")
    }
  }

  static async createDrill(drill: CreateDrillInput) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("drills")
        .insert([drill])
        .select()
        .single()

      if (error) throw error
      return data as Drill
    } catch (error) {
      console.error("Error creating drill:", error)
      throw new Error("Failed to create drill")
    }
  }

  static async updateDrill(id: string, drill: UpdateDrillInput) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("drills")
        .update(drill)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data as Drill
    } catch (error) {
      console.error("Error updating drill:", error)
      throw new Error("Failed to update drill")
    }
  }

  static async deleteDrill(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("drills")
        .delete()
        .eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting drill:", error)
      throw new Error("Failed to delete drill")
    }
  }
}
