"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { ReactNode } from "react";

interface FormSectionWrapperProps {
  value: string;
  title: string;
  icon: React.ElementType;
  children: ReactNode;
  tooltip?: string;
  className?: string;
}

export function FormSectionWrapper({
  value,
  title,
  icon: Icon,
  children,
  tooltip,
  className,
}: FormSectionWrapperProps) {
  const sectionId = `${value}-content`;
  const headerId = `${value}-header`;

  return (
    <AccordionItem
      value={value}
      className={cn("border rounded-lg", className)}
      role="region"
      aria-labelledby={headerId}
    >
      <div className="flex items-center px-4">
        <AccordionTrigger
          className="flex-1 hover:no-underline"
          id={headerId}
          aria-controls={sectionId}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
        </AccordionTrigger>

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  role="button"
                  tabIndex={0}
                  className="inline-flex cursor-pointer"
                  aria-label={`More information about ${title}`}
                  data-testid="help-icon"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="start"
                className="max-w-[300px]"
              >
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <AccordionContent
        id={sectionId}
        aria-labelledby={headerId}
        className="px-4 pt-4 pb-6"
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
