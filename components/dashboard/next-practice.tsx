import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function NextPractice() {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Next Practice</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">December 28, 2024</div>
          <p className="text-sm text-muted-foreground">6:30 PM - 8:30 PM</p>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Primary Focus: <span className="text-foreground">Hitting</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
