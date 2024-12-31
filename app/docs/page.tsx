import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Documentation</h1>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-600 mb-4">
              Welcome to the team management platform documentation. This guide
              will help you understand how to use the key features of the
              application.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Team Settings</h3>
                <p className="text-gray-600">
                  Configure your team's basic information, including team name,
                  division, season, and venue. You can also customize team
                  colors and add a description.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Practice Plans</h3>
                <p className="text-gray-600">
                  Create and manage practice plans for your team. Add drills,
                  set durations, and track progress over time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Schedule Management
                </h3>
                <p className="text-gray-600">
                  Use the calendar to schedule practices, games, and other team
                  events. Easily view and manage your team's schedule.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you need additional assistance or have questions, our support
              team is here to help.
            </p>
            <Button>Contact Support</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
