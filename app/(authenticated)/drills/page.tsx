import { AsyncBoundary } from "@/components/async-boundary"
import { DrillsClient } from "@/components/drills/drills-client"
import { createClient } from "@/lib/supabase/server"

async function getDrills() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("drills")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export default async function DrillsPage() {
  const initialDrills = await getDrills()

  return (
    <div className="space-y-6">
      <AsyncBoundary>
        <DrillsClient initialDrills={initialDrills} />
      </AsyncBoundary>
    </div>
  )
}
