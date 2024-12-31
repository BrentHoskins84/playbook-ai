"use client";

import { updateDrill } from "@/app/(dashboard)/drills/drill-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DrillRow, DrillWithTags } from "./forms/manual/types";

interface EditDrillDialogProps {
  drill: DrillRow;
}

export function EditDrillDialog({ drill }: EditDrillDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSuccess = async (updatedDrill: DrillWithTags) => {
    try {
      await updateDrill(drill.id, updatedDrill);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Drill updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update drill",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Drill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Drill</DialogTitle>
        </DialogHeader>
        {/* <DrillForm
          initialData={drill}
          onSuccess={handleFormSuccess}
          onError={(error) => {
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
          }}
        /> */}
      </DialogContent>
    </Dialog>
  );
}
