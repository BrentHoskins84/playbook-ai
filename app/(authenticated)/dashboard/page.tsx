import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

async function getStats() {
  const supabase = createClient()

  const [drillsResult, teamsResult, plansResult] = await Promise.all([
    supabase.from("drills").select("*", { count: 'exact', head: true }),
    supabase.from("teams").select("*", { count: 'exact', head: true }),
    supabase.from("practice_plans").select("*", { count: 'exact', head: true }),
  ])

  return {
    drills: drillsResult.count || 0,
    teams: teamsResult.count || 0,
    plans: plansResult.count || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drills}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.plans}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Practice Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              {/* Practice Plans List Component will go here */}
              <p className="text-sm text-muted-foreground">No recent practice plans</p>
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Drills</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              {/* Popular Drills List Component will go here */}
              <p className="text-sm text-muted-foreground">No drills available</p>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
