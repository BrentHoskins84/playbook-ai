"use client";

import { deleteDrill } from "@/app/(dashboard)/drills/drill-actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditDrillDialog } from "./edit-drill-dialog";
import { DrillRow } from "./forms/manual/types";

interface ClientDrillActionsProps {
  drill: DrillRow;
  initialUserStatus: {
    isAdmin: boolean;
    isCoach: boolean;
  };
}

export function ClientDrillActions({
  drill,
  initialUserStatus,
}: ClientDrillActionsProps) {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isAdmin = user ? user.isAdmin : initialUserStatus.isAdmin;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this drill?")) {
      setIsDeleting(true);
      try {
        await deleteDrill(drill.id as string);
        toast({
          title: "Success",
          description: "Drill deleted successfully",
        });
        router.push("/drills");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete drill",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex gap-2">
      <EditDrillDialog drill={drill} />
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Drill"}
      </Button>
    </div>
  );
}
