"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { CalendarEvent } from "../components/types";

interface CalendarContextType {
  selectedEvent: CalendarEvent | null;
  isDetailsModalOpen: boolean;
  openEventDetails: (event: CalendarEvent) => void;
  closeEventDetails: () => void;
  selectedDate: Date | null;
  isScheduleModalOpen: boolean;
  openScheduleCreation: (date: Date) => void;
  closeScheduleCreation: () => void;
}

// Create the context with a default undefined value
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

// Export the provider component
export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const openEventDetails = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  }, []);

  const closeEventDetails = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const openScheduleCreation = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsScheduleModalOpen(true);
  }, []);

  const closeScheduleCreation = useCallback(() => {
    setIsScheduleModalOpen(false);
    setSelectedDate(null);
  }, []);

  const value = {
    selectedEvent,
    isDetailsModalOpen,
    openEventDetails,
    closeEventDetails,
    selectedDate,
    isScheduleModalOpen,
    openScheduleCreation,
    closeScheduleCreation,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

// Export the hook
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
