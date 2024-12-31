"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardList, HelpCircle } from "lucide-react";
import { useDrillFormContext } from "../context/drill-form-context";
import { FormSectionWrapper } from "../shared/form-section-wrapper";
import { NumberedInputList } from "../shared/numbered-input-list";
import { SpaceRequired } from "../types";

// Helper function to handle number input changes with validation
const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: number) => void
) => {
  const value = e.target.value ? parseInt(e.target.value, 10) : 0;
  onChange(value);
};

// Helper function to format display names from snake_case to Title Case
const formatName = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * RequirementsSection handles the practical aspects of the drill setup.
 * This includes duration, player count, space requirements, and equipment needs.
 * Uses the form context to ensure all updates are tracked and validated properly.
 */
export function RequirementsSection() {
  // Get form methods and field arrays from context
  const { form, equipmentArray } = useDrillFormContext();

  // Normalize equipment fields to match the expected format for NumberedInputList
  const normalizedFields = equipmentArray.fields.map((field: any) => ({
    id: field.id,
    value: String(form.getValues(`required_equipment.${field.id}`) || ""),
  }));

  return (
    <FormSectionWrapper
      value="requirements"
      title="Requirements"
      icon={ClipboardList}
      tooltip="Specify the practical requirements for running this drill"
    >
      <div className="space-y-6">
        {/* Duration Input */}
        <FormField
          control={form.control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Duration (minutes)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="max-w-[300px]"
                    >
                      <p>Estimated time to complete the drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={field.value || ""}
                  onChange={(e) => handleNumberInput(e, field.onChange)}
                  className="transition-all focus:scale-[1.01]"
                />
              </FormControl>
              <FormDescription>
                Enter the approximate duration in minutes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Player Count Range */}
        <div className="grid grid-cols-2 gap-4">
          {/* Minimum Players */}
          <FormField
            control={form.control}
            name="player_count_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Minimum Players
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        className="max-w-[300px]"
                      >
                        <p>Minimum number of players needed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={field.value || ""}
                    onChange={(e) => handleNumberInput(e, field.onChange)}
                    className="transition-all focus:scale-[1.01]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Maximum Players */}
          <FormField
            control={form.control}
            name="player_count_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Maximum Players
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        className="max-w-[300px]"
                      >
                        <p>Maximum number of players recommended</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={field.value || ""}
                    onChange={(e) => handleNumberInput(e, field.onChange)}
                    className="transition-all focus:scale-[1.01]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Space Required */}
        <FormField
          control={form.control}
          name="space_required"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Space Required
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="start"
                      className="max-w-[300px]"
                    >
                      <p>Select the space needed for this drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all focus:scale-[1.01]">
                    <SelectValue placeholder="Select required space" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(SpaceRequired).map((space) => (
                    <SelectItem key={space} value={space}>
                      {formatName(space)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Specify the required space for this drill
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required Equipment List */}
        <NumberedInputList
          label="Required Equipment"
          tooltip="List all equipment needed for this drill"
          addButtonText="Add Equipment"
          placeholder="Enter equipment item"
          // @ts-ignore
          fieldArray={{
            ...equipmentArray,
            fields: normalizedFields,
          }}
          onChangeAction={(index, value) => {
            form.setValue(`required_equipment.${index}`, value, {
              shouldValidate: true,
            });
          }}
        />
      </div>
    </FormSectionWrapper>
  );
}
