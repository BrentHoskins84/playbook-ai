"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { MoreVertical, Edit, Trash, Calendar } from "lucide-react"
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
import { EditPracticePlanDialog } from "@/components/practice-plans/edit-practice-plan-dialog"
import { useToast } from "@/hooks/use-toast"
import { PracticePlansService, type PracticePlan } from "@/lib/services/practice-plans"

interface PracticePlanCardProps {
  plan: PracticePlan
  onPlanUpdated: () => void
}

export function PracticePlanCard({ plan, onPlanUpdated }: PracticePlanCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await PracticePlansService.deletePracticePlan(plan.id)

      toast({
        title: "Success",
        description: "Practice plan deleted successfully",
      })

      onPlanUpdated()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete practice plan",
      })
    }
  }

  // Calculate duration in minutes
  const duration = plan.start_time && plan.end_time
    ? (new Date(plan.end_time).getTime() - new Date(plan.start_time).getTime()) / (1000 * 60)
    : 0

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{plan.team.team_name}</CardTitle>
              <CardDescription>
                {format(parseISO(plan.start_time), "PPP")}
              </CardDescription>
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
            <Calendar className="h-4 w-4" />
            <span>{duration} minutes</span>
          </div>
          {plan.goals && (
            <p className="text-sm mt-2">
              <strong>Goals:</strong> {plan.goals}
            </p>
          )}
          {plan.generated_plan?.drills && (
            <div className="mt-4">
              <strong className="text-sm">Drills:</strong>
              <ul className="mt-2 space-y-2">
                {plan.generated_plan.drills.map((drillId, index) => (
                  <li key={drillId} className="text-sm">
                    Drill {index + 1}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the practice plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditPracticePlanDialog
        plan={plan}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onPlanUpdated={onPlanUpdated}
      />
    </>
  )
}
