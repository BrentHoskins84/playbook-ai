import { Suspense } from "react"
import { DrillsClient } from "@/components/drills/drills-client"
import { DrillsService } from "@/lib/services/drills"

export default async function DrillsPage() {
  // Fetch initial drills server-side
  const initialDrills = await DrillsService.getDrills()

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <DrillsClient initialDrills={initialDrills} />
      </Suspense>
    </div>
  )
}