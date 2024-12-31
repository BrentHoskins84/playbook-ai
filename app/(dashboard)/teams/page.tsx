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

// Dummy data for teams
const teams = [
  {
    id: 1,
    name: "Thunderbolts",
    division: "U12",
    players: 15,
    coach: "John Smith",
    status: "Active",
  },
  {
    id: 2,
    name: "Lightning Hawks",
    division: "U14",
    players: 18,
    coach: "Sarah Johnson",
    status: "Active",
  },
  {
    id: 3,
    name: "Red Dragons",
    division: "U16",
    players: 16,
    coach: "Mike Wilson",
    status: "Active",
  },
  {
    id: 4,
    name: "Blue Sharks",
    division: "U12",
    players: 14,
    coach: "Emma Davis",
    status: "Inactive",
  },
];

export default function TeamsPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-end items-center mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Team
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Head Coach</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.division}</TableCell>
                <TableCell>{team.players}</TableCell>
                <TableCell>{team.coach}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      team.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {team.status}
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
