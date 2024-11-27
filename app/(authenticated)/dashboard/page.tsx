import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ArrowUpIcon, ArrowDownIcon, ClipboardList, Users, Calendar, DollarSign } from 'lucide-react'
import { cn } from "@/lib/utils"

async function getStats() {
  const supabase = createClient()

  const [drillsResult, teamsResult, plansResult] = await Promise.all([
    supabase.from("drills").select("*", { count: 'exact', head: true }),
    supabase.from("teams").select("*", { count: 'exact', head: true }),
    supabase.from("practice_plans").select("*", { count: 'exact', head: true }),
  ])

  return {
    drills: {
      total: drillsResult.count || 0,
      trend: 3.48,
      trending: "up"
    },
    teams: {
      total: teamsResult.count || 0,
      trend: 5.20,
      trending: "up"
    },
    plans: {
      total: plansResult.count || 0,
      trend: 8.12,
      trending: "up"
    },
    money: {
      total: 53897,
      trend: 3.48,
      trending: "up"
    }
  }
}

function TrendIndicator({ trend, trending }: { trend: number; trending: "up" | "down" }) {
  return (
    <div className={cn(
      "flex items-center gap-1 text-xs font-medium",
      trending === "up" ? "text-emerald-600" : "text-red-600"
    )}>
      {trending === "up" ? (
        <ArrowUpIcon className="h-3 w-3" />
      ) : (
        <ArrowDownIcon className="h-3 w-3" />
      )}
      <span>{trend}% Since last month</span>
    </div>
  )
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Money</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.money.total.toLocaleString()}</div>
            <TrendIndicator trend={stats.money.trend} trending={stats.money.trending} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drills</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drills.total}</div>
            <TrendIndicator trend={stats.drills.trend} trending={stats.drills.trending} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teams.total}</div>
            <TrendIndicator trend={stats.teams.trend} trending={stats.teams.trending} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.plans.total}</div>
            <TrendIndicator trend={stats.plans.trend} trending={stats.plans.trending} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Practice Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent practice plans</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Drills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No drills available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

