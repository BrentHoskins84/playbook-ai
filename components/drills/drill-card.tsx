"use client"

import { useState } from "react"
import { MoreVertical, Edit, Trash } from "lucide-react"
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
import { EditDrillDialog } from "@/components/drills/edit-drill-dialog"
import { useToast } from "@/hooks/use-toast"
import { DrillsService, type Drill } from "@/lib/services/drills"

interface DrillCardProps {
  drill: Drill
  onDrillUpdated: () => void
}

export function DrillCard({ drill, onDrillUpdated }: DrillCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await DrillsService.deleteDrill(drill.id)

      toast({
        title: "Success",
        description: "Drill deleted successfully",
      })

      onDrillUpdated()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete drill",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{drill.name}</CardTitle>
              <CardDescription>{drill.skill_focus}</CardDescription>
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
          <p className="text-sm text-muted-foreground">{drill.description}</p>
          {drill.equipment && (
            <p className="text-sm mt-2">
              <strong>Equipment:</strong> {drill.equipment}
            </p>
          )}
          {drill.skill_level && (
            <p className="text-sm mt-1">
              <strong>Level:</strong> {drill.skill_level}
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the drill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditDrillDialog
        drill={drill}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onDrillUpdated={onDrillUpdated}
      />
    </>
  )
}
