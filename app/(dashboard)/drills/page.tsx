import { DashboardCard } from "@/components/card-wrapper";
import { DrillsTable } from "@/components/drills/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { getAllDrills } from "./drill-actions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DrillsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const drills = await getAllDrills();

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      {/* <DashboardCard gradient={1} className="mb-4">
        <></>
        {/* <DrillsFilters />
      </DashboardCard> */}

      <DashboardCard title="Drills" colSpan={4}>
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          }
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Drills Library</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Drill
            </Button>
          </div>
          <DrillsTable drills={drills} />
        </Suspense>
      </DashboardCard>
    </div>
  );
}
