"use server";

import {
  DrillTagRow,
  DrillWithTags,
} from "@/components/drills/forms/manual/types";
import { getProfile } from "@/lib/services/user-service";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDrill(id: string): Promise<DrillWithTags | null> {
  const supabase = await createClient();
  const { data: drill, error } = await supabase
    .from("drills")
    .select("*, drill_tags(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching drill:", error);
    return null;
  }

  return {
    ...drill,
    tags: drill.drill_tags.map((tag: DrillTagRow) => tag.tag),
  };
}

export async function getAllDrills(): Promise<DrillWithTags[]> {
  const supabase = await createClient();

  const { data: drills, error } = await supabase
    .from("drills")
    .select("*, drill_tags(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching drills:", error);
    return [];
  }

  return drills.map((drill) => ({
    ...drill,
    tags: drill.drill_tags.map((tag: DrillTagRow) => tag.tag),
  }));
}

export async function updateDrill(
  id: string,
  drillData: Partial<DrillWithTags>
): Promise<DrillWithTags | null> {
  const supabase = await createClient();
  const { tags, drill_tags, ...drillWithoutTags } = drillData;

  const { data, error } = await supabase
    .from("drills")
    .update(drillWithoutTags)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating drill:", error);
    throw new Error("Failed to update drill");
  }

  // Update tags
  if (tags) {
    await supabase.from("drill_tags").delete().eq("drill_id", id);
    const tagInserts = tags.map((tag) => ({ drill_id: id, tag }));
    const { error: tagError } = await supabase
      .from("drill_tags")
      .insert(tagInserts);

    if (tagError) {
      console.error("Error updating drill tags:", tagError);
    }
  }

  revalidatePath(`/drills/${id}`);
  return await getDrill(id);
}

export async function deleteDrill(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("drills").delete().eq("id", id);

  if (error) {
    console.error("Error deleting drill:", error);
    throw new Error("Failed to delete drill");
  }

  revalidatePath("/drills");
}

export async function isUserAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.is_admin || false;
}

export async function getInitialUserStatus(): Promise<{
  isAdmin: boolean;
  isCoach: boolean;
}> {
  const profile = await getProfile();
  const supabase = await createClient();

  const { data: teamMember } = await supabase
    .from("team_members")
    .select("role")
    .eq("user_id", profile?.id)
    .single();

  return {
    isAdmin: profile?.is_admin || false,
    isCoach: !!teamMember?.role,
  };
}
