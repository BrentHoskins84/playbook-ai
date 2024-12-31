import { MonthCalendar } from "@/components/dashboard/month-calendar";
import { PracticePlansTable } from "@/components/dashboard/practice-plans-table";
import { TeamInformation } from "@/components/dashboard/team-information";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-stat-card">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium dark:text-white/40 light:text-blue-100/70 uppercase tracking-wider">
                NEXT PRACTICE
              </p>
              <p className="dashboard-stat-value dark:text-white/40 light:text-blue-100/70">
                December 28, 2024
              </p>
              <p className="text-sm dark:text-white/40 light:text-blue-100/70">
                6:30 PM - 8:30 PM
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs dark:text-white/40 light:text-blue-100/70">
                Primary Focus:
              </span>
              <span className="text-xs dark:text-white/60 light:text-blue-100/70">
                Hitting
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <p className="text-xs font-medium dark:text-white/40 light:text-blue-100/70 uppercase tracking-wider mb-2">
            TOTAL PLAYERS
          </p>
          <p className="dashboard-stat-value">24</p>
        </div>

        <div className="dashboard-stat-card">
          <p className="text-xs font-medium dark:text-white/40 light:text-blue-100/70 uppercase tracking-wider mb-2">
            PRACTICE PLANS
          </p>
          <p className="dashboard-stat-value">12</p>
        </div>

        <div className="dashboard-stat-card">
          <p className="text-xs font-medium dark:text-white/40 light:text-blue-100/70 uppercase tracking-wider mb-2">
            TEAM FOCUS
          </p>
          <p className="dashboard-stat-value">Defense</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="dashboard-card lg:col-span-2">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">MONTH CALENDAR</h3>
          </div>
          <div className="p-6">
            <MonthCalendar />
          </div>
        </Card>

        <Card className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">PERFORMANCE</h3>
          </div>
          <div className="p-6">
            <h4 className="text-lg font-medium text-white mb-4">
              Total orders
            </h4>
            {/* Performance chart here */}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="dashboard-card lg:col-span-2">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">PRACTICE PLANS</h3>
          </div>
          <div className="px-6">
            <PracticePlansTable />
          </div>
        </Card>

        <Card className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">TEAM INFORMATION</h3>
          </div>
          <div className="px-6">
            <TeamInformation />
          </div>
        </Card>
      </div>
    </div>
  );
}
