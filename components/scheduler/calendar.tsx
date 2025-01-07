"use client";

import { getSchedules } from "@/app/(dashboard)/schedule/actions";
import { useUser } from "@/context/auth-context";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  NavigateAction,
  View,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CustomMonthView } from "./components/month-view";
import { PracticeDetailsModal } from "./components/practice-details-modal";
import { CustomToolbar } from "./components/toolbar";
import { CalendarEvent, Schedule } from "./components/types";
import { CalendarProvider, useCalendar } from "./context/calendar-context";
import { CreateScheduleForm } from "./create-schedule-form";
import "./styles/calendar-styles.css";

const localizer = momentLocalizer(moment);

const AVAILABLE_VIEWS = {
  month: CustomMonthView,
  week: true,
  day: true,
} as const;

type AvailableView = keyof typeof AVAILABLE_VIEWS;

function CalendarContent() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<AvailableView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get our calendar context functions
  const { openEventDetails, openScheduleCreation } = useCalendar();

  const fetchSchedules = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const fetchedSchedules = await getSchedules(user.id);
      setSchedules(fetchedSchedules);
      setError(null);
    } catch (error) {
      setError("Failed to fetch schedules");
      console.error("Error fetching schedules:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Update slot selection to use our context
  const handleSelectSlot = useCallback(
    ({ start }: { start: Date }) => {
      openScheduleCreation(start);
    },
    [openScheduleCreation]
  );

  const handleNavigate = useCallback(
    (newDate: Date, view?: View, action?: NavigateAction) => {
      setCurrentDate(newDate);
    },
    []
  );

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view as AvailableView);
  }, []);

  const events: CalendarEvent[] = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.goals || "Schedule",
    start: new Date(schedule.start_time),
    end: new Date(schedule.end_time),
    goals: schedule.goals,
  }));

  if (isLoading) {
    return <div className="text-center py-4">Loading schedules...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-destructive">Error: {error}</div>
    );
  }

  return (
    <div className="dashboard-card h-full">
      <div className="dashboard-card-content h-[calc(100%-4rem)]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={openEventDetails}
          selectable
          className="custom-calendar"
          views={AVAILABLE_VIEWS}
          view={currentView}
          date={currentDate}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          components={{
            // @ts-ignore
            toolbar: CustomToolbar,
            month: {
              dateHeader: ({ date }) => <span>{moment(date).format("D")}</span>,
            },
          }}
        />
      </div>

      <CreateScheduleForm onScheduleCreated={fetchSchedules} />
      <PracticeDetailsModal />
    </div>
  );
}

export default function ScheduleCalendar() {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
}
