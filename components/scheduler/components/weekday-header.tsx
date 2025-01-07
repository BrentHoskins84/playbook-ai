import React from "react";
import { WeekdayHeaderProps } from "./types";

export const WeekdayHeader: React.FC<WeekdayHeaderProps> = ({
  weekdayLabels,
}) => {
  return (
    <div className="custom-month-header">
      {weekdayLabels.map((day: string, i: number) => (
        <div key={i} className="custom-month-header-cell">
          {day}
        </div>
      ))}
    </div>
  );
};
