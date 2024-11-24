"use client"

import { useState } from "react"
import { MoreVertical, Edit, Trash, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditTeamDialog } from "@/components/teams/edit-team-dialog"
import { useToast } from "@/hooks/use-toast"
import { TeamsService, type Team } from "@/lib/services/teams"

interface TeamCardProps {
  team: Team
  onTeamUpdated: () => void
}

export function TeamCard({ team, onTeamUpdated }: TeamCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await TeamsService.deleteTeam(team.id)

      toast({
        title: "Success",
        description: "Team deleted successfully",
      })

      onTeamUpdated()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.level}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{team.total_players} players</span>
          </div>
          {team.practice_days && team.practice_days.length > 0 && (
            <p className="text-sm mt-2">
              <strong>Practice Days:</strong> {team.practice_days.join(", ")}
            </p>
          )}
          {team.notes && (
            <p className="text-sm mt-2">
              <strong>Notes:</strong> {team.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTeamDialog
        team={team}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onTeamUpdated={onTeamUpdated}
      />
    </>
  )
}
