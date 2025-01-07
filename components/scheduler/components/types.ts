import { Tables } from "@/types/supabase";
import { DateLocalizer } from "react-big-calendar";

export type Schedule = Tables<"practices">;

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  goals: string | null;
}

export interface DayData {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isOffRange: boolean;
}

export interface CustomMonthViewProps {
  date: Date;
  localizer: DateLocalizer;
  events: CalendarEvent[];
  max: Date;
  min: Date;
  scrollToTime: Date;
  selected: Date;
  onSelectEvent?: (event: CalendarEvent) => void;
}

export interface DayCellProps {
  day: DayData;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

export interface EventItemProps {
  event: CalendarEvent;
  onSelectEvent?: (event: CalendarEvent) => void;
}

export interface WeekdayHeaderProps {
  weekdayLabels: string[];
}
