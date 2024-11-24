"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { CreatePracticePlanDialog } from "@/components/practice-plans/create-practice-plan-dialog"
import { AsyncBoundary } from "@/components/async-boundary"
import type { PracticePlan } from "@/lib/services/practice-plans"
import type { Team } from "@/lib/services/teams"

interface CalendarViewProps {
  initialPlans: PracticePlan[]
  teams: Team[]
}

export function CalendarView({ initialPlans, teams }: CalendarViewProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>()
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    try {
      const calendarEvents = initialPlans.map(plan => ({
        id: plan.id,
        title: `${plan.team.name} (${plan.duration}min)`,
        start: plan.date,
        extendedProps: {
          teamName: plan.team.name,
          duration: plan.duration,
          focusAreas: plan.focus_areas,
          notes: plan.notes
        }
      }))
      setEvents(calendarEvents)
    } catch (error) {
      console.error("Error processing calendar events:", error)
    }
  }, [initialPlans])

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr)
    setShowCreateDialog(true)
  }

  const handleEventClick = (arg: any) => {
    // Event click handling
  }

  return (
    <AsyncBoundary>
      <div className="bg-background rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek"
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventContent={(arg) => (
            <div className="p-1">
              <div className="font-semibold text-sm truncate">
                {arg.event.extendedProps.teamName}
              </div>
              <div className="text-xs text-muted-foreground">
                {arg.event.extendedProps.duration}min
              </div>
            </div>
          )}
        />
      </div>

      <CreatePracticePlanDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        teams={teams}
        defaultDate={selectedDate}
      />
    </AsyncBoundary>
  )
}
