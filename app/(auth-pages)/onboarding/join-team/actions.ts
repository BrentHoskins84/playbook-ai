"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function joinTeam(teamCode: string) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/oauth");
    }

    // Find the team by code
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name")
      .eq("code", teamCode)
      .single();

    if (teamError || !team) {
      throw new Error("Invalid team code. Please check and try again.");
    }

    // Check if already a member
    const { data: existingMember, error: memberCheckError } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", team.id)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      throw new Error("You are already a member of this team.");
    }

    // Create team member record
    const { error: createError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "assistant_coach",
    });

    if (createError) {
      throw new Error("Failed to join team. Please try again.");
    }
  } catch (error) {
    console.error("Error in joinTeam:", error);
    throw error;
  }
}
