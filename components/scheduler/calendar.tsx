"use client";

import { getSchedules } from "@/app/(dashboard)/schedule/actions";
import { useUser } from "@/context/auth-context";
import { Tables } from "@/types/supabase";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CardWrapper } from "../card-wrapper";
import { Spinner } from "../spinner";
import { CreateScheduleForm } from "./components/create-schedule-form";
import { PracticeDetailsModal } from "./components/practice-details-modal";
import { CalendarEvent } from "./types";

// Date localizer setup
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Main Calendar Component
export default function SchedulerCalendar() {
  const [schedules, setSchedules] = useState<Tables<"practices">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch schedules
  const fetchSchedules = useCallback(async () => {
    console.log("Fetching schedules...");
    console.log("User:", user);

    if (!user) return;

    setIsLoading(true);
    try {
      const fetchedSchedules = await getSchedules(user.id);
      console.log("Fetched schedules:", fetchedSchedules);

      setSchedules(fetchedSchedules);
      setError(null);
    } catch (err) {
      setError("Failed to fetch schedules");
      console.error("Error fetching schedules:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Event handlers
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  }, []);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start);
    setShowCreateForm(true);
  }, []);

  // Transform schedules to calendar events
  const events: CalendarEvent[] = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.goals || "Practice",
    start: new Date(schedule.start_time),
    end: new Date(schedule.end_time),
    goals: schedule.goals,
  }));

  return (
    <CardWrapper>
      {isLoading ? (
        <div className="h-[calc(100vh-12rem)] justify-center items-center flex">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-4 text-destructive">{error}</div>
      ) : (
        <div className="h-[calc(100vh-12rem)] bg-background">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            views={["month", "week", "day"]}
            defaultView="month"
            className="rounded-lg bg-card text-card-foreground shadow-sm"
          />

          <PracticeDetailsModal
            event={selectedEvent}
            isOpen={showEventDetails}
            onClose={() => {
              setShowEventDetails(false);
              setSelectedEvent(null);
            }}
          />

          <CreateScheduleForm
            selectedDate={selectedDate}
            isOpen={showCreateForm}
            onCloseAction={() => {
              setShowCreateForm(false);
              setSelectedDate(null);
            }}
            onScheduleCreatedAction={fetchSchedules}
          />
        </div>
      )}
    </CardWrapper>
  );
}
