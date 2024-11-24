import { Suspense } from "react"
import { CalendarView } from "@/components/calendar/calendar-view"
import { PracticePlansService } from "@/lib/services/practice-plans"
import { TeamsService } from "@/lib/services/teams"

export default async function CalendarPage() {
  const [plans, teams] = await Promise.all([
    PracticePlansService.getPracticePlans(),
    TeamsService.getTeams(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CalendarView initialPlans={plans} teams={teams} />
      </Suspense>
    </div>
  )
}