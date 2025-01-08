import { Tables } from "@/types/supabase";

export type Schedule = Tables<"practices">;

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  goals?: string | null;
}

export interface PracticeDetailsModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateScheduleFormProps {
  onScheduleCreatedAction: () => void;
  selectedDate: Date | null;
  isOpen: boolean;
  onCloseAction: () => void;
}
