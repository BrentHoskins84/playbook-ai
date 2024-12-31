"use client";

import { saveDrill } from "@/app/(dashboard)/drills/save-drill";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect, useState } from "react";
import { useFieldArray, UseFieldArrayReturn, useForm } from "react-hook-form";

import { DEFAULT_FORM_VALUES, FORM_SECTIONS } from "../constants";
import { DrillFormData, DrillFormProps, StepStatus } from "../types";
import { drillFormSchema } from "../validation";

// Define more specific types for our field arrays
type FieldArrayType = UseFieldArrayReturn<DrillFormData, any, "id">;

// Define our teaching points arrays structure with proper typing
interface TeachingPointsArrays {
  mainPoints: FieldArrayType;
  setup: FieldArrayType;
  execution: FieldArrayType;
  coachingCues: FieldArrayType;
}

// Update our context value type with proper typing
interface DrillFormContextValue {
  form: ReturnType<typeof useForm<DrillFormData>>;
  steps: StepStatus[];
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  equipmentArray: FieldArrayType;
  teachingPointsArrays: TeachingPointsArrays;
}

// Create our context with a default value of null
const DrillFormContext = createContext<DrillFormContextValue | null>(null);

export function DrillFormProvider({
  children,
  initialData,
  onSuccess,
  onError,
}: DrillFormProps & { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with properly typed default values
  // @ts-ignore - Using ts-ignore as we did in the original implementation
  const form = useForm<DrillFormData>({
    resolver: zodResolver(drillFormSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      ...(initialData || {}), // Handle undefined initialData
    },
  });

  // Track form section completion status
  const [steps, setSteps] = useState<StepStatus[]>(
    FORM_SECTIONS.map((section) => ({
      isComplete: false,
      label: section.label,
    }))
  );

  // Initialize equipment array with proper typing
  const equipmentArray = useFieldArray({
    control: form.control,
    name: "required_equipment",
  }) as FieldArrayType;

  // Initialize teaching points arrays with proper typing
  const teachingPointsArrays: TeachingPointsArrays = {
    mainPoints: useFieldArray({
      control: form.control,
      name: "teaching_points.main_points",
    }) as FieldArrayType,
    setup: useFieldArray({
      control: form.control,
      name: "teaching_points.setup",
    }) as FieldArrayType,
    execution: useFieldArray({
      control: form.control,
      name: "teaching_points.execution",
    }) as FieldArrayType,
    coachingCues: useFieldArray({
      control: form.control,
      name: "teaching_points.coaching_cues",
    }) as FieldArrayType,
  };

  // Watch form values to update section completion status
  useEffect(() => {
    const subscription = form.watch((formValues) => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];

        // Update completion status for each section
        newSteps[0].isComplete = !!(
          formValues.title &&
          formValues.description &&
          formValues.video_url &&
          formValues.tags?.length
        );

        newSteps[1].isComplete = !!(
          formValues.primary_category && formValues.skill_level
        );

        newSteps[2].isComplete = !!(
          formValues.duration_minutes &&
          formValues.player_count_min &&
          formValues.player_count_max &&
          formValues.space_required
        );

        const teachingPoints = formValues.teaching_points;
        newSteps[3].isComplete = !!(
          teachingPoints?.main_points?.length &&
          teachingPoints?.setup?.length &&
          teachingPoints?.execution?.length
        );

        return newSteps;
      });
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handle form submission
  const handleSubmit = async (data: DrillFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataWithTags = {
        ...data,
        tags: form.getValues("tags") || [],
      };

      const result = await saveDrill(formDataWithTags);

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Drill saved successfully",
        });
        form.reset(DEFAULT_FORM_VALUES);
        onSuccess?.(result.data);
      } else {
        const errorMessage = result.error || "Failed to save drill";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        "An unexpected error occurred while saving the drill";
      console.error("Error saving drill:", err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DrillFormContext.Provider
      value={{
        form,
        steps,
        isSubmitting,
        error,
        handleSubmit: form.handleSubmit(handleSubmit),
        equipmentArray,
        teachingPointsArrays,
      }}
    >
      {children}
    </DrillFormContext.Provider>
  );
}

// Hook to use the form context
export function useDrillFormContext() {
  const context = useContext(DrillFormContext);
  if (!context) {
    throw new Error(
      "useDrillFormContext must be used within a DrillFormProvider"
    );
  }
  return context;
}
