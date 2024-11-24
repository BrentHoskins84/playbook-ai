"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PracticePlansService, PracticePlanSchema, focusAreaOptions } from "@/lib/services/practice-plans"
import type { Team } from "@/lib/services/teams"

interface CreatePracticePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teams: Team[]
  defaultDate?: string
}

export function CreatePracticePlanDialog({
  open,
  onOpenChange,
  teams,
  defaultDate,
}: CreatePracticePlanDialogProps) {
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(PracticePlanSchema),
    defaultValues: {
      team_id: "",
      date: defaultDate || new Date().toISOString().split('T')[0],
      duration: 90,
      focus_areas: [],
      notes: "",
      drills: [],
    },
  })

  async function onSubmit(values: any) {
    try {
      // Generate AI practice plan
      const generatedPlan = await PracticePlansService.generatePracticePlan({
        team_id: values.team_id,
        date: values.date,
        duration: values.duration,
        focus_areas: values.focus_areas,
      })

      // Create the practice plan
      await PracticePlansService.createPracticePlan({
        ...values,
        drills: generatedPlan.drills,
      })

      toast({
        title: "Success",
        description: "Practice plan created successfully",
      })

      form.reset()
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create practice plan",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Practice Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="team_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                    <Textarea
                      placeholder="Any additional notes for this practice..."
                      {...field}
                    />
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
              <Button type="submit">Create Plan</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
