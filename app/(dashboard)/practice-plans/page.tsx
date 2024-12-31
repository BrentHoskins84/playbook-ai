import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

// Dummy data for practice plans
const practicePlans = [
  {
    id: 1,
    name: "Pre-Season Conditioning",
    duration: "90 mins",
    focus: "Conditioning",
    lastModified: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Offensive Drills",
    duration: "60 mins",
    focus: "Offense",
    lastModified: "2024-01-14",
    status: "Draft",
  },
  {
    id: 3,
    name: "Defense Fundamentals",
    duration: "75 mins",
    focus: "Defense",
    lastModified: "2024-01-13",
    status: "Active",
  },
  {
    id: 4,
    name: "Game Preparation",
    duration: "120 mins",
    focus: "Full Practice",
    lastModified: "2024-01-12",
    status: "Active",
  },
];

export default function PracticePlansPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-end items-center mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Practice Plan
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Focus Area</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {practicePlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>{plan.focus}</TableCell>
                <TableCell>{plan.lastModified}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      plan.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
