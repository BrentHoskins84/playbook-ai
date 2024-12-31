import type { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

// Type for Google OAuth data we care about
export interface GoogleProfile {
  email: string;
  full_name: string;
  avatar_url: string;
}

// Function to check if profile needs update
function hasProfileChanges(
  existing: Profile,
  google: GoogleProfile
): ProfileUpdate | null {
  const changes: ProfileUpdate = {};
  let hasChanges = false;

  if (existing.email !== google.email) {
    changes.email = google.email;
    hasChanges = true;
  }
  if (existing.full_name !== google.full_name) {
    changes.full_name = google.full_name;
    hasChanges = true;
  }
  if (existing.avatar_url !== google.avatar_url) {
    changes.avatar_url = google.avatar_url;
    hasChanges = true;
  }

  return hasChanges ? changes : null;
}

export async function handleProfile(
  supabase: SupabaseClient,
  userId: string,
  googleData: GoogleProfile
) {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching profile:", fetchError);
      throw fetchError;
    }

    if (!existingProfile) {
      // Create new profile
      const { error: createError } = await supabase.from("profiles").insert({
        id: userId,
        email: googleData.email,
        full_name: googleData.full_name,
        avatar_url: googleData.avatar_url,
        is_verified: true,
        is_approved: true,
      });

      if (createError) {
        console.error("Error creating profile:", createError);
        throw createError;
      }

      console.log("Created new profile for user:", userId);
      return { isNew: true };
    }

    // Check for changes in existing profile
    const changes = hasProfileChanges(existingProfile, googleData);
    if (changes) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(changes)
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }

      console.log("Updated profile for user:", userId, "Changes:", changes);
      return { isNew: false, changes };
    }

    return { isNew: false };
  } catch (error) {
    console.error("Profile handling error:", error);
    throw error;
  }
}
