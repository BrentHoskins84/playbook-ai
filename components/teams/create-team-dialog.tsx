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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { TeamsService, TeamSchema, teamLevelOptions, daysOfWeek } from "@/lib/services/teams"

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      name: "",
      level: "",
      total_players: 0,
      practice_days: [],
      notes: "",
    },
  })

  async function onSubmit(values: any) {
    try {
      await TeamsService.createTeam(values)

      toast({
        title: "Success",
        description: "Team created successfully",
      })

      form.reset()
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create team",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lightning Strikers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamLevelOptions.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
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
              name="total_players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Players</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
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
              name="practice_days"
              render={() => (
                <FormItem>
                  <FormLabel>Practice Days</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="practice_days"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), day])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) => value !== day
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
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
                      placeholder="Any additional information about the team..."
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
              <Button type="submit">Create Team</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
