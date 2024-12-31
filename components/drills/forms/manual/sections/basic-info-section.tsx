"use client";

import { TagInput } from "@/components/drills/forms/manual/shared/tag-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Info } from "lucide-react";
import { useDrillFormContext } from "../context/drill-form-context";
import { FormSectionWrapper } from "../shared/form-section-wrapper";

/**
 * BasicInfoSection handles the collection of fundamental drill information.
 * This includes the title, description, video URL, and tags that help identify
 * and categorize the drill. Using our form context ensures all state updates
 * are properly tracked and reflected in the progress indicator.
 */
export function BasicInfoSection() {
  // Get form methods and state from our context instead of the hook
  const { form } = useDrillFormContext();

  return (
    <FormSectionWrapper
      value="basic-info"
      title="Basic Information"
      icon={Info}
      tooltip="Enter the fundamental details about your drill"
    >
      <div className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Drill Title
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
                      <p>Enter a clear, descriptive title for your drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter drill title"
                  className="transition-all focus:scale-[1.01]"
                />
              </FormControl>
              <FormDescription>Keep it clear and concise</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Description
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
                      <p>Provide a comprehensive overview of the drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the drill"
                  className="resize-none min-h-[100px] transition-all focus:scale-[1.01]"
                />
              </FormControl>
              <FormDescription>
                Explain the drill's purpose and expected outcomes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video URL Field */}
        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Video URL
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
                      <p>Add a video demonstration of the drill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Enter video URL"
                  type="url"
                  className="transition-all focus:scale-[1.01]"
                />
              </FormControl>
              <FormDescription>
                YouTube or Vimeo links recommended
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Field */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Tags
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
                      <p>
                        Add relevant keywords to help categorize and find this
                        drill
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <TagInput
                  value={field.value || []}
                  onChangeAction={(tags) => {
                    const filteredTags = tags.filter(Boolean);
                    field.onChange(filteredTags);
                    form.setValue("tags", filteredTags, {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormControl>
              <FormDescription>
                Press enter or comma to add tags
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSectionWrapper>
  );
}
