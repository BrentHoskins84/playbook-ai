"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email-service"
import { CoachApprovalModal } from "./coach-approval-modal"

type Coach = {
  id: string
  email: string
  name: string
  team_name: string
  status: string
}

export function CoachApprovalList() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const response = await fetch('/api/coaches')
      if (!response.ok) {
        throw new Error('Failed to fetch coaches')
      }
      const data = await response.json()
      setCoaches(data)
    } catch (error) {
      console.error("Error fetching coaches:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch coaches. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (coach: Coach, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setSelectedCoach(coach)
      setIsModalOpen(true)
    } else {
      try {
        const response = await fetch('/api/coaches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: coach.id, action }),
        })

        if (!response.ok) {
          throw new Error(`Failed to ${action} coach`)
        }

        await sendRejectionEmail(coach.email)
        toast({
          title: "Coach Rejected",
          description: `${coach.name} has been rejected and notified.`,
        })

        fetchCoaches()
      } catch (error) {
        console.error(`Error ${action}ing coach:`, error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to ${action} coach. Please try again.`,
        })
      }
    }
  }

  const handleApprove = async (teamId: string, teamName: string) => {
    if (!selectedCoach) return

    try {
      const response = await fetch('/api/coaches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedCoach.id, action: 'approve', teamId, teamName }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve coach')
      }

      await sendApprovalEmail(selectedCoach.email)
      toast({
        title: "Coach Approved",
        description: `${selectedCoach.name} has been approved and notified.`,
      })

      fetchCoaches()
    } catch (error) {
      console.error('Error approving coach:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve coach. Please try again.",
      })
    } finally {
      setIsModalOpen(false)
      setSelectedCoach(null)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Coach Approvals</h2>
      {coaches.length === 0 ? (
        <p>No pending coach approvals.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coaches.map((coach) => (
              <TableRow key={coach.id}>
                <TableCell>{coach.name}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.team_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{coach.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleAction(coach, 'approve')}>
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleAction(coach, 'reject')}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedCoach && (
        <CoachApprovalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          coachName={selectedCoach.name}
          coachTeam={selectedCoach.team_name}
        />
      )}
    </div>
  )
}
