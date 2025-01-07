import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import React from "react";
import { useCalendar } from "../context/calendar-context";

export const PracticeDetailsModal: React.FC = () => {
  const { selectedEvent, isDetailsModalOpen, closeEventDetails } =
    useCalendar();

  if (!selectedEvent) return null;

  const startTime = moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a");
  const endTime = moment(selectedEvent.end).format("h:mm a");
  const duration = moment
    .duration(moment(selectedEvent.end).diff(moment(selectedEvent.start)))
    .asMinutes();

  return (
    <Dialog open={isDetailsModalOpen} onOpenChange={closeEventDetails}>
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

          {selectedEvent.goals && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Practice Goals</h3>
              <p className="text-sm">{selectedEvent.goals}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
