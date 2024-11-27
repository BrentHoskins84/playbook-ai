import { Edit, Trash, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { EditDrillDialog } from "@/components/drills/edit-drill-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Drill } from "@/lib/services/drills"
import Link from "next/link"

interface DrillRowProps {
  drill: Drill
  onDrillUpdated: () => void
}

export function DrillRow({ drill, onDrillUpdated }: DrillRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/drills?id=${drill.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete drill")

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
      <div className="flex items-center justify-between p-4">
        <Link href={`/drills/${drill.id}`} className="flex-1 grid gap-1 hover:underline">
          <div className="flex items-center">
            <span className="font-medium">{drill.name}</span>
            <Badge variant="secondary" className="ml-2">
              {drill.skill_focus}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {drill.brief_description}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {drill.skill_level && (
            <Badge variant="outline">{drill.skill_level}</Badge>
          )}
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
      </div>

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
