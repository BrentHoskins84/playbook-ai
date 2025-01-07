"use client";
import SchedulerCalendar from "@/components/scheduler/calendar";

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Practice Plans</h1>
        {/* <CreateScheduleForm /> */}
      </div>

      <SchedulerCalendar />
    </div>
  );
}
