import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useCalendar } from "./context/calendar-context";

interface CreateScheduleFormProps {
  onScheduleCreated: () => void;
}

export const CreateScheduleForm: React.FC<CreateScheduleFormProps> = ({
  onScheduleCreated,
}) => {
  const { selectedDate, isScheduleModalOpen, closeScheduleCreation } =
    useCalendar();

  const handleClose = () => {
    closeScheduleCreation();
  };

  return (
    <Dialog open={isScheduleModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Practice</DialogTitle>
        </DialogHeader>

        {/* Your existing form content here */}
      </DialogContent>
    </Dialog>
  );
};
