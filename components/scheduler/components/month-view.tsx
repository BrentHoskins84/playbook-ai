import moment from "moment";
import React from "react";
import { DateRange, NavigateAction } from "react-big-calendar";
import { DayCell } from "./day-cell";
import { CustomMonthViewProps, DayData } from "./types";
import { WeekdayHeader } from "./weekday-header";

export class CustomMonthView extends React.Component<CustomMonthViewProps> {
  static navigate(date: Date, action: NavigateAction): Date {
    switch (action) {
      case "PREV":
        return new Date(date.getFullYear(), date.getMonth() - 1, 1);
      case "NEXT":
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
      case "TODAY":
        return new Date();
      default:
        return date;
    }
  }

  static title(date: Date): string {
    return moment(date).format("MMMM YYYY");
  }

  static range(date: Date): DateRange {
    const start = moment(date).startOf("month").startOf("week").toDate();
    const end = moment(date).endOf("month").endOf("week").toDate();
    return { start, end };
  }

  getWeeksForMonth(): DayData[][] {
    const { date, events } = this.props;
    const start = moment(date).startOf("month").startOf("week");
    const end = moment(date).endOf("month").endOf("week");
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    for (
      let current = start.clone();
      current.isBefore(end);
      current.add(1, "day")
    ) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      const currentDate = current.toDate();
      currentWeek.push({
        date: currentDate,
        events: events.filter((event) =>
          moment(event.start).isSame(currentDate, "day")
        ),
        isToday: moment().isSame(currentDate, "day"),
        isOffRange: !moment(currentDate).isSame(date, "month"),
      });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  render() {
    const weekdayLabels = moment.weekdaysShort();
    const weeks = this.getWeeksForMonth();

    return (
      <div className="custom-month-view">
        <WeekdayHeader weekdayLabels={weekdayLabels} />
        <div className="custom-month-body">
          {weeks.map((week, weekIndex: number) => (
            <div key={weekIndex} className="custom-month-row">
              {week.map((day, dayIndex: number) => (
                <DayCell key={dayIndex} day={day} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
