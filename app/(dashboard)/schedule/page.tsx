"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns/format";
import { getDay } from "date-fns/getDay";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

// Dummy events data - replace with real data from your backend
const events = [
  {
    title: "Team Practice",
    start: new Date(2024, 11, 24, 18, 30), // Dec 24, 2024, 6:30 PM
    end: new Date(2024, 11, 24, 20, 30), // Dec 24, 2024, 8:30 PM
  },
  {
    title: "Conditioning Session",
    start: new Date(2024, 11, 30, 17, 0), // Dec 30, 2024, 5:00 PM
    end: new Date(2024, 11, 30, 18, 30), // Dec 30, 2024, 6:30 PM
  },
];

export default function SchedulePage() {
  const [myEvents, setMyEvents] = useState(events);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Handle new event creation
    console.log("Selected slot:", { start, end });
    // Add logic to open modal/form for creating new event
  };

  const handleSelectEvent = (event: any) => {
    // Handle event click
    console.log("Selected event:", event);
    // Add logic to open modal/form for editing event
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex justify-end items-center">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Practice
        </Button>
      </div>

      <Card className="p-4">
        <div className="h-[75vh]">
          <Calendar
            localizer={localizer}
            events={myEvents}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            popup
            views={["month", "week", "day"]}
            defaultView="month"
          />
        </div>
      </Card>
    </div>
  );
}
