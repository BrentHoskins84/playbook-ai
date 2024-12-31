"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { HelpCircle, TagIcon } from "lucide-react";
import { useDrillFormContext } from "../context/drill-form-context";
import { FormSectionWrapper } from "../shared/form-section-wrapper";
import { DrillCategoryType, SkillLevelType } from "../types";

// This helper function transforms category and skill level values into readable text
// For example: "quick_release" becomes "Quick Release"
const formatName = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Detailed descriptions for each drill category to help users make informed choices
const categoryDescriptions: Record<DrillCategoryType, string> = {
  hitting: "Drills focused on batting skills and technique",
  fielding: "Defensive drills to improve glove work",
  pitching: "Drills for throwing mechanics and accuracy",
  catching: "Specialized drills for the catcher position",
  baserunning: "Drills to improve speed and awareness on the bases",
  conditioning: "Drills for overall fitness and endurance",
};

// Detailed descriptions for each skill level to guide appropriate selection
const skillLevelDescriptions: Record<SkillLevelType, string> = {
  beginner: "Designed for players with little to no experience",
  intermediate: "For players with moderate experience",
  advanced: "Challenging drills for experienced players",
  all: "Drills adaptable to all skill levels",
};

/**
 * CategorizationSection handles the classification of drills by their type and difficulty.
 * It uses the form context to ensure all changes are properly tracked and validated,
 * automatically updating the progress indicator when selections are made.
 */
export function CategorizationSection() {
  // Access the form methods from our context
  const { form } = useDrillFormContext();

  return (
    <FormSectionWrapper
      value="categorization"
      title="Categorization"
      icon={TagIcon}
      tooltip="Classify the drill by type and difficulty level"
    >
      <div className="space-y-6">
        {/* Primary Category Selection */}
        <FormField
          control={form.control}
          name="primary_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Primary Category
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
                      <p>Select the main focus area of this drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    aria-label="Select the primary category for the drill"
                    className="transition-all focus:scale-[1.01]"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(categoryDescriptions).map(
                    ([key, description]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatName(key)}</span>
                          <span className="text-sm text-muted-foreground">
                            {description}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best represents the main focus of this
                drill
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skill Level Selection */}
        <FormField
          control={form.control}
          name="skill_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Skill Level
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
                      <p>Choose the experience level required for this drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    aria-label="Select the skill level for the drill"
                    className="transition-all focus:scale-[1.01]"
                  >
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(skillLevelDescriptions).map(
                    ([key, description]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatName(key)}</span>
                          <span className="text-sm text-muted-foreground">
                            {description}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the appropriate difficulty level for optimal player
                development
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSectionWrapper>
  );
}
