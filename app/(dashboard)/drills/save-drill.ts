"use server";

import {
  DrillFormData,
  FormSubmissionResponse,
} from "@/components/drills/forms/manual/types";
import { drillFormSchema } from "@/components/drills/forms/manual/validation";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function saveDrill(
  formData: DrillFormData
): Promise<FormSubmissionResponse> {
  const supabase = await createClient();

  try {
    const validatedData = drillFormSchema.parse(formData);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Authentication failed");

    const { tags, ...drillData } = validatedData;

    const { data: drill, error: drillInsertError } = await supabase
      .from("drills")
      .insert({
        ...drillData,
        created_by: user.id,
        status: "published",
        view_count: 0,
        practice_plan_usage_count: 0,
      })
      .select()
      .single();

    if (drillInsertError) {
      console.error("Error saving drill:", drillInsertError);
      throw new Error("Failed to save drill");
    }

    // Insert tags
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag) => ({ drill_id: drill.id, tag }));
      const { error: tagInsertError } = await supabase
        .from("drill_tags")
        .insert(tagInserts);

      if (tagInsertError) {
        console.error("Error saving tags:", tagInsertError);
      }
    }

    revalidatePath("/drills");

    return { success: true, data: { ...drill, tags } };
  } catch (error) {
    console.error("Error in saveDrill:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
