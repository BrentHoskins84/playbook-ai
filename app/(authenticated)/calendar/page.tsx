import { Suspense } from "react"
import { CalendarView } from "@/components/calendar/calendar-view"
import { getPracticePlans } from "@/lib/services/practice-plans-server"
import { getTeams } from "@/lib/services/teams-server"

export default async function CalendarPage() {
  const [plans, teams] = await Promise.all([
    getPracticePlans(),
    getTeams(),
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
