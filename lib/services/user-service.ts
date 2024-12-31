import { type Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error in getProfile:", error);
    return null;
  }
}

// Add other user-related functions here
// export async function updateProfile() { ... }
// export async function updateAvatar() { ... }
// export async function deleteProfile() { ... }
