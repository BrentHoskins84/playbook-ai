"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { PracticePlansService, PracticePlanSchema, focusAreaOptions, type PracticePlan } from "@/lib/services/practice-plans"

interface EditPracticePlanDialogProps {
  plan: PracticePlan
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlanUpdated: () => void
}

export function EditPracticePlanDialog({
  plan,
  open,
  onOpenChange,
  onPlanUpdated,
}: EditPracticePlanDialogProps) {
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(PracticePlanSchema),
    defaultValues: {
      team_id: plan.team_id,
      date: plan.date,
      duration: plan.duration,
      focus_areas: plan.focus_areas,
      notes: plan.notes,
      drills: plan.drills,
    },
  })

  async function onSubmit(values: any) {
    try {
      await PracticePlansService.updatePracticePlan(plan.id, values)

      toast({
        title: "Success",
        description: "Practice plan updated successfully",
      })

      onPlanUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update practice plan",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Practice Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) =>
                          field.onChange(format(date as Date, "yyyy-MM-dd"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={30}
                      step={15}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="focus_areas"
              render={() => (
                <FormItem>
                  <FormLabel>Focus Areas</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {focusAreaOptions.map((area) => (
                      <FormField
                        key={area}
                        control={form.control}
                        name="focus_areas"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={area}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(area)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), area])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) => value !== area
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {area}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
           </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
