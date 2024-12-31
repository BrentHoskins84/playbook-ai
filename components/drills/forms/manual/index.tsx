"use client";

import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertCircle, Save } from "lucide-react";

import {
  DrillFormProvider,
  useDrillFormContext,
} from "./context/drill-form-context";
import { FormProgress } from "./progress-indicator";
import { BasicInfoSection } from "./sections/basic-info-section";
import { CategorizationSection } from "./sections/categorization-section";
import { RequirementsSection } from "./sections/requirements-section";
import { TeachingPointsSection } from "./sections/teaching-points-section";
import { DrillFormProps } from "./types";

/**
 * DrillForm is the main component for creating and editing drills.
 * It uses a context-based approach to manage form state and validation,
 * ensuring all child components stay in sync with the form's state.
 */
export function DrillForm({ initialData, onSuccess, onError }: DrillFormProps) {
  return (
    // DrillFormProvider wraps the entire form, making form state available to all children
    <DrillFormProvider
      initialData={initialData}
      onSuccess={onSuccess}
      onError={onError}
    >
      <DrillFormContent />
    </DrillFormProvider>
  );
}

/**
 * DrillFormContent contains the actual form UI components.
 * It's separated from the main component to ensure clean context usage
 * and to prevent unnecessary re-renders of the provider.
 */
function DrillFormContent() {
  const { form, steps, isSubmitting, error, handleSubmit } =
    useDrillFormContext();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress tracking */}
        <FormProgress />

        {/* Form sections */}
        <Accordion
          type="single"
          collapsible
          defaultValue="basic-info"
          className="space-y-4"
        >
          {/* Each section is a separate component that uses the form context */}
          <BasicInfoSection />
          <CategorizationSection />
          <RequirementsSection />
          <TeachingPointsSection />
        </Accordion>

        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form actions */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t mt-auto -mx-6">
          <div className="container flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Drill"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
