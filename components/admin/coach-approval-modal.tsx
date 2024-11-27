"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Check, ChevronsUpDown, AlertCircle } from 'lucide-react'
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { getTeams } from "@/lib/services/teams-server"
import { cn } from "@/lib/utils"

// Define the Team type explicitly
interface Team {
  id: string;
  team_name: string;
}

// Improved function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9\s]/g, '')
  const s2 = str2.toLowerCase().replace(/[^a-z0-9\s]/g, '')

  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)

  let matchedWords = 0
  let totalWords = Math.max(words1.length, words2.length)

  words1.forEach(word => {
    if (words2.includes(word)) {
      matchedWords++
    }
  })

  return matchedWords / totalWords
}

interface CoachApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: (teamId: string, teamName: string) => void
  coachName: string
  coachTeam?: string
}

interface BestMatch {
  teamId: string;
  similarity: number;
}

export function CoachApprovalModal({ isOpen, onClose, onApprove, coachName, coachTeam }: CoachApprovalModalProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [suggestedTeamId, setSuggestedTeamId] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      team: "",
      newTeam: "",
    },
  })

  useEffect(() => {
    let isMounted = true
    const loadTeams = async () => {
      if (isOpen) {
        try {
          setIsLoading(true)
          const teamsData = await getTeams()

          if (isMounted && teamsData && coachTeam) {
            // Find similar team names
            let bestMatch: BestMatch | null = null
            const similarityThreshold = 0.4 // Adjusted threshold for better matching

            teamsData.forEach(team => {
              const similarity = calculateSimilarity(team.team_name, coachTeam)
              if (similarity > similarityThreshold && (!bestMatch || similarity > bestMatch.similarity)) {
                bestMatch = { teamId: team.id, similarity }
              }
            })

            if (bestMatch) {
              // @ts-ignore
              setSuggestedTeamId(bestMatch.teamId)
              // @ts-ignore
              form.setValue("team", bestMatch.teamId)
            } else {
              form.setValue("newTeam", coachTeam)
            }

            setTeams(teamsData)
          }
        } catch (error) {
          console.error("Error loading teams:", error)
        } finally {
          if (isMounted) {
            setIsLoading(false)
          }
        }
      }
    }
    loadTeams()
    return () => {
      isMounted = false
    }
  }, [isOpen, coachTeam, form])

  const onSubmit = (data: { team: string; newTeam: string }) => {
    if (data.team) {
      const selectedTeam = teams.find(team => team.id === data.team)
      if (selectedTeam) {
        onApprove(selectedTeam.id, selectedTeam.team_name)
      }
    } else if (data.newTeam) {
      onApprove("", data.newTeam)
    }
    onClose()
  }

  const filteredTeams = teams.filter((team) =>
    team.team_name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const suggestedTeam = teams.find(team => team.id === suggestedTeamId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Coach: {coachName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {suggestedTeam && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Suggested Team Match</AlertTitle>
                <AlertDescription>
                  We found a potential match: {suggestedTeam.team_name}
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Existing Team</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? teams.find((team) => team.id === field.value)?.team_name
                            : "Select team..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0 w-[--radix-popover-trigger-width]">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search team..."
                          value={searchValue}
                          onValueChange={setSearchValue}
                        />
                        <CommandList>
                          {isLoading ? (
                            <CommandEmpty>Loading teams...</CommandEmpty>
                          ) : filteredTeams.length === 0 ? (
                            <CommandEmpty>No team found.</CommandEmpty>
                          ) : (
                            <CommandGroup>
                              {filteredTeams.map((team) => (
                                <CommandItem
                                  key={team.id}
                                  value={team.team_name}
                                  onSelect={() => {
                                    form.setValue("team", team.id)
                                    setOpen(false)
                                  }}
                                  className={cn(
                                    team.id === suggestedTeamId && "bg-muted"
                                  )}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === team.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {team.team_name}
                                  {team.id === suggestedTeamId && (
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      (Suggested Match)
                                    </span>
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newTeam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Or Add New Team</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter new team name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Approve</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

