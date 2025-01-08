"use client";

import { PracticePlanNewForm } from "@/components/practice-plan/new-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { CreateScheduleFormProps } from "../types";

export const CreateScheduleForm: React.FC<CreateScheduleFormProps> = ({
  onScheduleCreatedAction,
  selectedDate,
  isOpen,
  onCloseAction,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Practice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Selected Date:{" "}
            {selectedDate
              ? selectedDate.toLocaleDateString()
              : "No date selected"}
          </p>
          <PracticePlanNewForm date={selectedDate} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
