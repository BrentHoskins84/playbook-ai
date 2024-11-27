import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Drill } from "@/lib/services/drills"
import Link from "next/link"
import { ArrowLeft, Share2 } from 'lucide-react'

interface DrillViewProps {
  drill: Drill
}

export function DrillView({ drill }: DrillViewProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/drills">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Drills
          </Link>
        </Button>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Drill
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{drill.name}</CardTitle>
            <Badge>{drill.skill_focus}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Brief Description</h3>
            <p>{drill.brief_description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Skill Level</h3>
              <Badge variant="outline">{drill.skill_level}</Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Positions Applicable</h3>
              <div className="flex flex-wrap gap-2">
                {drill.positions_applicable?.map((position) => (
                  <Badge key={position} variant="secondary">
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {drill.equipment_needed && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Equipment Needed</h3>
              <p>{drill.equipment_needed}</p>
            </div>
          )}
          {drill.detailed_instructions && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Instructions</h3>
              <p className="whitespace-pre-wrap">{drill.detailed_instructions}</p>
            </div>
          )}
          {drill.coaching_tips && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Coaching Tips</h3>
              <p className="whitespace-pre-wrap">{drill.coaching_tips}</p>
            </div>
          )}
          {drill.reference_link && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Reference</h3>
              <a
                href={drill.reference_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {drill.reference_link}
              </a>
            </div>
          )}
          {drill.source_notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Source Notes</h3>
              <p>{drill.source_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

