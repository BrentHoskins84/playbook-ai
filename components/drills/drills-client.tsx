"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DrillsList } from "@/components/drills/drills-list"
import { CreateDrillDialog } from "@/components/drills/create-drill-dialog"
import type { Drill } from "@/lib/services/drills"

interface DrillsClientProps {
  initialDrills: Drill[]
}

export function DrillsClient({ initialDrills }: DrillsClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Drills</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Drill
        </Button>
      </div>

      <DrillsList initialDrills={initialDrills} />
      <CreateDrillDialog open={open} onOpenChange={setOpen} />
    </>
  )
}