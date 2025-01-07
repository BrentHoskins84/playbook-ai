import React from "react";
import { EventItem } from "./event-item";
import { DayCellProps } from "./types";

export const DayCell: React.FC<DayCellProps> = ({ day, onSelectSlot }) => {
  const handleClick = () => {
    if (onSelectSlot) {
      const start = new Date(day.date);
      const end = new Date(day.date);
      end.setHours(23, 59, 59);
      onSelectSlot({ start, end });
    }
  };

  return (
    <div
      className={`custom-month-cell ${
        day.isToday ? "today" : ""
      } ${day.isOffRange ? "off-range" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className="cell-header">{day.date.getDate()}</div>
      <div className="cell-content">
        {day.events.map((event, index) => (
          <EventItem key={`${event.id}-${index}`} event={event} />
        ))}
      </div>
    </div>
  );
};
