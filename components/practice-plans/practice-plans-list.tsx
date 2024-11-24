"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PracticePlanCard } from "@/components/practice-plans/practice-plan-card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { PracticePlansService, type PracticePlan } from "@/lib/services/practice-plans"

interface PracticePlansListProps {
  initialPlans: PracticePlan[]
}

export function PracticePlansList({ initialPlans }: PracticePlansListProps) {
  const [plans, setPlans] = useState<PracticePlan[]>(initialPlans)
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const startDate = date ? format(date, "yyyy-MM-dd") : undefined
        const data = await PracticePlansService.getPracticePlans(undefined, startDate)
        setPlans(data)
      } catch (error) {
        console.error("Error fetching practice plans:", error)
      }
    }

    fetchPlans()
  }, [date])

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {plans.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No practice plans found. Create your first plan to get started!
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PracticePlanCard
              key={plan.id}
              plan={plan}
              onPlanUpdated={async () => {
                const startDate = date ? format(date, "yyyy-MM-dd") : undefined
                const updatedPlans = await PracticePlansService.getPracticePlans(
                  undefined,
                  startDate
                )
                setPlans(updatedPlans)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}