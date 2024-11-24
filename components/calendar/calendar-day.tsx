"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { PracticePlan } from "@/lib/services/practice-plans"

interface CalendarDayProps {
  date: Date
  plans: PracticePlan[]
  onClick: () => void
}

export function CalendarDay({ date, plans, onClick }: CalendarDayProps) {
  const isToday = format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")

  return (
    <div
      className={cn(
        "min-h-[120px] bg-background p-2 hover:bg-accent cursor-pointer",
        isToday && "bg-accent"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <span
          className={cn(
            "text-sm",
            isToday && "font-bold"
          )}
        >
          {format(date, "d")}
        </span>
      </div>
      <div className="mt-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="mb-1 rounded bg-primary/10 p-1 text-xs"
          >
            <div className="font-medium">{plan.team.name}</div>
            <div className="text-muted-foreground">
              {plan.duration} min
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}