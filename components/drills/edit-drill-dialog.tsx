"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { DrillSchema, skillFocusOptions, skillLevelOptions, positionOptions, type Drill } from "@/lib/services/drills"
import { useState } from "react"

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
  const [showAdvanced, setShowAdvanced] = useState(false)
  const form = useForm({
    resolver: zodResolver(DrillSchema),
    defaultValues: {
      name: drill.name,
      skill_focus: drill.skill_focus,
      brief_description: drill.brief_description,
      positions_applicable: drill.positions_applicable || [],
      skill_level: drill.skill_level || "",
      equipment_needed: drill.equipment_needed || "",
      reference_link: drill.reference_link || "",
      source_notes: drill.source_notes || "",
      detailed_instructions: drill.detailed_instructions || "",
      coaching_tips: drill.coaching_tips || "",
    },
  })

  async function onSubmit(values: any) {
    try {
      const response = await fetch("/api/drills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: drill.id, ...values }),
      })

      if (!response.ok) throw new Error("Failed to update drill")

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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Drill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 px-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drill Name</FormLabel>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </div>
                <FormField
                  control={form.control}
                  name="brief_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="positions_applicable"
                    render={() => (
                      <FormItem>
                        <FormLabel>Positions Applicable</FormLabel>
                        <div className="space-y-2">
                          {positionOptions.map((position) => (
                            <FormField
                              key={position.id}
                              control={form.control}
                              name="positions_applicable"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={position.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(position.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, position.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== position.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {position.label}
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
                    name="skill_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equipment_needed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Needed</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reference_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Link</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com/drill-video"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Optional: Add link to original video/post</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="source_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Hide" : "Show"} Advanced Options
                </Button>
                {showAdvanced && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="detailed_instructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Instructions</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coaching_tips"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coaching Tips</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
