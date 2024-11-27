"use client"

import { useEffect, useState } from "react"
import { DrillRow } from "@/components/drills/drills-row"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Drill } from "@/lib/services/drills"
import { skillFocusOptions } from "@/lib/services/drills"

interface DrillsListProps {
  initialDrills: Drill[]
}

export function DrillsList({ initialDrills }: DrillsListProps) {
  const [drills, setDrills] = useState<Drill[]>(initialDrills)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [skillFocus, setSkillFocus] = useState<string>("all")

  useEffect(() => {
    const fetchDrills = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (search) params.append("search", search)
        if (skillFocus && skillFocus !== "all") params.append("skillFocus", skillFocus)

        const response = await fetch(`/api/drills?${params}`)
        const data = await response.json()
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
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
            <SelectItem value="all">All Skills</SelectItem>
            {skillFocusOptions.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drills</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-border rounded-md border">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : drills.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No drills found. Create your first drill to get started!
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {drills.map((drill) => (
                <DrillRow
                  key={drill.id}
                  drill={drill}
                  onDrillUpdated={async () => {
                    const response = await fetch("/api/drills")
                    const data = await response.json()
                    setDrills(data)
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
