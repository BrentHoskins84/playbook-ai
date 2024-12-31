"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, HelpCircle } from "lucide-react";
import { useDrillFormContext } from "../context/drill-form-context";
import { FormSectionWrapper } from "../shared/form-section-wrapper";
import { NumberedInputList } from "../shared/numbered-input-list";

/**
 * TeachingPointsSection manages all instructional aspects of a drill.
 * It breaks down teaching into four key areas:
 * - Main Points: Core learning objectives
 * - Setup Instructions: How to prepare the drill
 * - Execution Steps: How to perform the drill
 * - Coaching Cues: Quick reminders for coaches
 *
 * The component uses our form context to ensure all updates are tracked
 * and automatically reflected in the progress indicator.
 */
export function TeachingPointsSection() {
  // Get form methods and teaching points arrays from context
  const { form, teachingPointsArrays } = useDrillFormContext();

  // Configuration for each teaching point section
  // This helps maintain consistency and makes the component more maintainable
  const sectionsConfig = [
    {
      fieldArray: teachingPointsArrays.mainPoints,
      fieldName: "teaching_points.main_points",
      label: "Main Points",
      tooltip: "Key objectives and takeaways for this drill",
      addButtonText: "Add Point",
      placeholder: "Enter a key learning point",
      description: "Add the primary teaching objectives for this drill",
    },
    {
      fieldArray: teachingPointsArrays.setup,
      fieldName: "teaching_points.setup",
      label: "Setup Instructions",
      tooltip: "Steps to prepare the drill setup",
      addButtonText: "Add Setup Step",
      placeholder: "Enter a setup instruction",
      description: "List the steps needed to set up this drill",
    },
    {
      fieldArray: teachingPointsArrays.execution,
      fieldName: "teaching_points.execution",
      label: "Execution Steps",
      tooltip: "Steps to execute the drill",
      addButtonText: "Add Execution Step",
      placeholder: "Enter an execution step",
      description: "Detail how the drill should be performed",
    },
    {
      fieldArray: teachingPointsArrays.coachingCues,
      fieldName: "teaching_points.coaching_cues",
      label: "Coaching Cues",
      tooltip: "Quick reminders for coaches",
      addButtonText: "Add Cue",
      placeholder: "Enter a coaching cue",
      description: "Add quick verbal cues for coaching this drill",
    },
  ] as const; // Make this configuration immutable

  return (
    <FormSectionWrapper
      value="teaching-points"
      title="Teaching Points"
      icon={BookOpen}
      tooltip="Add detailed instructional elements for this drill"
    >
      <div className="space-y-8">
        {sectionsConfig.map((section) => {
          // Normalize fields to match NumberedInputList expectations
          const normalizedFields = section.fieldArray.fields.map(
            (field: any) => ({
              id: field.id,
              value: String(
                form.getValues(`${section.fieldName}.${field.id}`) || ""
              ),
            })
          );

          return (
            <div key={section.fieldName} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {section.label}
                </span>
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
                      <p>{section.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <NumberedInputList
                label={section.label}
                tooltip={section.tooltip}
                addButtonText={section.addButtonText}
                placeholder={section.placeholder}
                // @ts-ignore
                fieldArray={{
                  ...section.fieldArray,
                  fields: normalizedFields,
                }}
                onChangeAction={(index, value) => {
                  form.setValue(`${section.fieldName}.${index}`, value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          );
        })}
      </div>
    </FormSectionWrapper>
  );
}
