import moment from "moment";
import React from "react";
import { useCalendar } from "../context/calendar-context";
import { EventItemProps } from "./types";

export const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const { openEventDetails } = useCalendar();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEventDetails(event);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEventDetails(event);
    }
  };

  return (
    <div
      className="custom-event hover:bg-accent/50 cursor-pointer rounded px-2 py-1 text-sm"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Practice: ${event.title}`}
    >
      <div className="event-time font-medium">
        {moment(event.start).format("HH:mm")} -{" "}
        {moment(event.end).format("HH:mm")}
      </div>
      <div className="event-title truncate">{event.title}</div>
      {event.goals && (
        <div className="event-goals text-xs text-muted-foreground truncate">
          {event.goals}
        </div>
      )}
    </div>
  );
};
