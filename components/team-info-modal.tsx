"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

enum TeamLevel {
  Rec = "rec",
  Travel = "travel",
  College = "college",
  HighSchool = "high school"
}

const teamInfoSchema = z.object({
  total_players: z.number().min(1, "Team must have at least 1 player"),
  team_level: z.nativeEnum(TeamLevel, {
    errorMap: () => ({ message: "Please select a team level" }),
  }),
})

type TeamInfoFormData = z.infer<typeof teamInfoSchema>

interface TeamInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TeamInfoFormData) => Promise<void>
  teamName: string
}

export function TeamInfoModal({ isOpen, onClose, onSubmit, teamName }: TeamInfoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<TeamInfoFormData>({
    resolver: zodResolver(teamInfoSchema),
    defaultValues: {
      total_players: 0,
      team_level: undefined,
    },
  })

  const handleSubmit = async (data: TeamInfoFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast({
        title: "Team information updated",
        description: "Your team information has been successfully updated.",
      })
      onClose()
      router.refresh() // Reload the page
    } catch (error) {
      console.error("Error updating team information:", error)
      toast({
        title: "Error",
        description: "There was an error updating your team information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Team Information</DialogTitle>
          <DialogDescription>
            Please provide the following information for {teamName} to continue.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="total_players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Players</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TeamLevel).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Team Information"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

