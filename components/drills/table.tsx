import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Clock, Medal, Users } from "lucide-react";
import Link from "next/link";
import { DrillRow } from "./forms/manual/types";

interface DrillsTableProps {
  drills: DrillRow[];
}

export function DrillsTable({ drills }: DrillsTableProps) {
  if (!drills.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No drills found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Drill</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drills.map((drill) => (
            <TableRow key={drill.id}>
              <TableCell>
                <div className="flex items-center space-x-4">
                  {/* {drill.thumbnail_url && (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={drill.thumbnail_url}
                        alt={drill.title}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    </div>
                  )} */}
                  <div>
                    <Link
                      href={`/drills/${drill.id}`}
                      className="font-medium hover:underline"
                    >
                      {drill.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {drill.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {drill.primary_category}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {drill.duration_minutes}m
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {drill.player_count_min}-{drill.player_count_max}
                  </div>
                  <div className="flex items-center">
                    <Medal className="w-4 h-4 mr-1" />
                    {drill.skill_level}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {(drill.created_by as any).full_name}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/drills/${drill.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
