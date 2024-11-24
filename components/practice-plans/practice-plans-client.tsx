"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PracticePlansList } from "@/components/practice-plans/practice-plans-list"
import { CreatePracticePlanDialog } from "@/components/practice-plans/create-practice-plan-dialog"
import { AsyncBoundary } from "@/components/async-boundary"
import type { PracticePlan } from "@/lib/services/practice-plans"
import type { Team } from "@/lib/services/teams"

interface PracticePlansClientProps {
  initialPlans: PracticePlan[]
  teams: Team[]
}

export function PracticePlansClient({ initialPlans, teams }: PracticePlansClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Practice Plans</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <AsyncBoundary>
        <PracticePlansList initialPlans={initialPlans} />
      </AsyncBoundary>
      <CreatePracticePlanDialog
        open={open}
        onOpenChange={setOpen}
        teams={teams}
      />
    </>
  )
}
