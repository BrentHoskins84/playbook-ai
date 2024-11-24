"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
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
import { useToast } from "@/hooks/use-toast"
import type { Drill } from "./drills-list"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  skill_focus: z.string().min(1, "Please select a skill focus"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  skill_level: z.string().optional(),
  equipment: z.string().optional(),
})

const skillFocusOptions = [
  "Fielding",
  "Batting",
  "Pitching",
  "Baserunning",
  "Catching",
  "Conditioning",
]

const skillLevelOptions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
]

interface EditDrillDialogProps {
  drill: Drill
  open: boolean
  onOpenChange: (open: boolean) => void
  onDrillUpdated: () => void
}

export function EditDrillDialog({
  drill,
  open,
  onOpenChange,
  onDrillUpdated,
}: EditDrillDialogProps) {
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: drill.name,
      skill_focus: drill.skill_focus,
      description: drill.description,
      skill_level: drill.skill_level,
      equipment: drill.equipment,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from("drills")
        .update(values)
        .eq("id", drill.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Drill updated successfully",
      })

      onDrillUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update drill",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Drill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skill_focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Focus</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill focus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillFocusOptions.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skill_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillLevelOptions.map((level) => (
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
              name="equipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Needed</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
