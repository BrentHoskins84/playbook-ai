import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import React from "react";
import { PracticeDetailsModalProps } from "../types";

export const PracticeDetailsModal: React.FC<PracticeDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!event) return null;

  const startTime = moment(event.start).format("MMMM Do YYYY, h:mm a");
  const endTime = moment(event.end).format("h:mm a");
  const duration = moment
    .duration(moment(event.end).diff(moment(event.start)))
    .asMinutes();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Practice Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Date and Time</h3>
            <p className="text-sm">
              {startTime} - {endTime}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {duration} minutes
            </p>
          </div>

          {event.goals && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Practice Goals</h3>
              <p className="text-sm">{event.goals}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
