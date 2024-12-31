"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useDrillFormContext } from "./context/drill-form-context";

/**
 * FormProgress displays the current completion status of the drill form.
 * It shows both a visual progress bar and individual step indicators.
 * The component automatically updates as sections are completed through
 * our form context.
 */
export function FormProgress() {
  // Get steps status from our form context
  const { steps } = useDrillFormContext();

  // Calculate progress percentage for the progress bar
  const completedSteps = steps.filter((step) => step.isComplete).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div
      className="p-6 bg-background"
      role="progressbar"
      aria-valuenow={completedSteps}
      aria-valuemin={0}
      aria-valuemax={steps.length}
      aria-valuetext={`${completedSteps} of ${steps.length} steps completed`}
    >
      <div className="flex justify-between relative">
        {/* Background progress line */}
        <div
          className="absolute top-5 left-0 w-full h-[2px] bg-muted"
          aria-hidden="true"
        />

        {/* Animated progress bar */}
        <div
          className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
          aria-hidden="true"
        />

        {/* Step indicators */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative z-10"
            aria-label={`Step ${index + 1}: ${step.label}`}
            aria-current={step.isComplete ? "step" : undefined}
          >
            {/* Circle indicator */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                "border-2",
                step.isComplete
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              )}
            >
              {step.isComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "text-sm mt-2 font-medium",
                step.isComplete ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
