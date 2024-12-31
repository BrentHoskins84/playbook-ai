import { MonthCalendar } from "@/components/dashboard/month-calendar";
import { NextPractice } from "@/components/dashboard/next-practice";
import { PracticePlansTable } from "@/components/dashboard/practice-plans-table";
import { TeamInformation } from "@/components/dashboard/team-information";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <NextPractice />
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Practice Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Team Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Defense</div>
          </CardContent>
        </Card>
      </div>
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Month Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthCalendar />
        </CardContent>
      </Card>
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Practice Plans</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <PracticePlansTable />
        </CardContent>
      </Card>
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Team Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <TeamInformation />
        </CardContent>
      </Card>
    </div>
  );
}
