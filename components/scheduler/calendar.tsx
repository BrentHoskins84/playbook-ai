"use client";

import { getSchedules } from "@/app/(dashboard)/schedule/actions";
import { useUser } from "@/context/auth-context";
import { Tables } from "@/types/supabase";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CardWrapper } from "../card-wrapper";
import { Spinner } from "../spinner";
import { CreateScheduleForm } from "./components/create-schedule-form";
import { PracticeDetailsModal } from "./components/practice-details-modal";
import { CalendarEvent } from "./types";

// Move localizer outside component to prevent recreation
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

const initialModalState = {
  selectedEvent: null as CalendarEvent | null,
  showEventDetails: false,
  selectedDate: null as Date | null,
  showCreateForm: false,
};

export default function SchedulerCalendar() {
  const [schedules, setSchedules] = useState<Tables<"practices">[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: isLoading } = useUser();
  const userId = user?.id;

  const [modalState, setModalState] = useState(initialModalState);

  // Memoize fetchSchedules to prevent unnecessary re-renders
  const fetchSchedules = useCallback(async () => {
    if (!userId) return;

    try {
      const fetchedSchedules = await getSchedules(userId);
      setSchedules(fetchedSchedules);
      setError(null);
    } catch (err) {
      setError("Failed to fetch schedules");
      console.error("Error fetching schedules:", err);
    }
  }, [userId]); // Only depend on user.id, not the entire user object

  useEffect(() => {
    if (userId) {
      fetchSchedules();
    }
  }, [userId, fetchSchedules]);

  // Memoize event handlers
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setModalState((prev) => ({
      ...prev,
      selectedEvent: event,
      showEventDetails: true,
    }));
  }, []);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setModalState((prev) => ({
      ...prev,
      selectedDate: start,
      showCreateForm: true,
    }));
  }, []);

  // Memoize events array
  const events = useMemo(
    () =>
      schedules.map((schedule) => ({
        id: schedule.id,
        title: schedule.goals || "Practice",
        start: new Date(schedule.start_time),
        end: new Date(schedule.end_time),
        goals: schedule.goals,
      })),
    [schedules]
  );

  const handleCloseEventDetails = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      showEventDetails: false,
      selectedEvent: null,
    }));
  }, []);

  const handleCloseCreateForm = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      showCreateForm: false,
      selectedDate: null,
    }));
  }, []);

  if (isLoading) {
    return (
      <CardWrapper>
        <div className="h-[calc(100vh-12rem)] justify-center items-center flex">
          <Spinner />
        </div>
      </CardWrapper>
    );
  }

  if (error) {
    return (
      <CardWrapper>
        <div className="text-center py-4 text-destructive">{error}</div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
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
          event={modalState.selectedEvent}
          isOpen={modalState.showEventDetails}
          onClose={handleCloseEventDetails}
        />

        <CreateScheduleForm
          selectedDate={modalState.selectedDate}
          isOpen={modalState.showCreateForm}
          onCloseAction={handleCloseCreateForm}
          onScheduleCreatedAction={fetchSchedules}
        />
      </div>
    </CardWrapper>
  );
}
