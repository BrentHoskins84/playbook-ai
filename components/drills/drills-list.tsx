"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DrillCard } from "@/components/drills/drill-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DrillsService, type Drill, skillFocusOptions } from "@/lib/services/drills"

interface DrillsListProps {
  initialDrills: Drill[]
}

export function DrillsList({ initialDrills }: DrillsListProps) {
  const [drills, setDrills] = useState<Drill[]>(initialDrills)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [skillFocus, setSkillFocus] = useState<string>("")

  useEffect(() => {
    const fetchDrills = async () => {
      try {
        setLoading(true)
        const data = await DrillsService.searchDrills(search, skillFocus)
        setDrills(data)
      } catch (error) {
        console.error("Error fetching drills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrills()
  }, [search, skillFocus])

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search drills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={skillFocus} onValueChange={setSkillFocus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Skill Focus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Skills</SelectItem>
            {skillFocusOptions.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div>Loading drills...</div>
      ) : drills.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No drills found. Create your first drill to get started!
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drills.map((drill) => (
            <DrillCard 
              key={drill.id} 
              drill={drill} 
              onDrillUpdated={async () => {
                const updatedDrills = await DrillsService.searchDrills(search, skillFocus)
                setDrills(updatedDrills)
              }} 
            />
          ))}
        </div>
      )}
    </div>
  )
}