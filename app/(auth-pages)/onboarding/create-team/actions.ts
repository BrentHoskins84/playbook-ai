"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface SimilarTeam {
  name: string;
  similarity: number;
}

interface TeamNameCheck {
  name: string;
  similarity: number;
}

export async function checkTeamName(teamName: string): Promise<SimilarTeam[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("check_similar_team_names", {
      team_name: teamName,
      similarity_threshold: 0.6, // This is a good threshold
    });

    console.log("Data:", data);
    console.log("Error:", error);
    console.log("Team Name:", teamName);

    if (error) {
      console.error("Error checking team name:", error);
      throw new Error("Failed to check team name");
    }

    return data.map((team: TeamNameCheck) => ({
      name: team.name,
      similarity: team.similarity,
    }));
  } catch (error) {
    console.error("Error in checkTeamName:", error);
    throw error;
  }
}

export async function createTeam(
  teamName: string,
  teamLevel: string,
  ageGroup: string
) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/oauth");
    }

    // Check for similar teams one final time
    const similarTeams = await checkTeamName(teamName);
    if (similarTeams.length > 0) {
      throw new Error("Similar team name already exists");
    }

    // Generate unique team code
    const teamCode = await generateUniqueTeamCode();

    // Create team record
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: teamName,
        code: teamCode,
        team_level: teamLevel,
        age_group: ageGroup,
        head_coach_id: user.id,
      })
      .select("id, head_coach_id")
      .single();

    if (teamError) {
      console.error("Error creating team:", teamError);
      throw new Error("Failed to create team");
    }

    // Create team member record
    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: teamData.id,
      user_id: user.id,
      role: "head_coach",
    });

    if (memberError) {
      console.error("Error creating team member:", memberError);
      throw new Error("Failed to associate user with team");
    }

    return teamCode;
  } catch (error) {
    console.error("Error in createTeam action:", error);
    throw error;
  }
}

async function generateUniqueTeamCode(): Promise<string> {
  const supabase = await createClient();
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const maxAttempts = 50; // Increased max attempts

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Generate a random 6-character code
      const code = Array.from({ length: 6 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join("");

      // Check if code exists
      const { data, error } = await supabase
        .from("teams")
        .select("code")
        .eq("code", code);

      if (error) {
        console.error("Error checking team code:", error);
        continue;
      }

      // If no data returned, code is unique
      if (!data || data.length === 0) {
        return code;
      }

      console.log(`Code ${code} already exists, trying again...`);
    } catch (error) {
      console.error("Error generating team code:", error);
      continue;
    }
  }

  throw new Error(
    "Unable to generate a unique team code after multiple attempts. Please try again later."
  );
}

export async function requestTeamAccess(
  teamName: string,
  similarTeam: SimilarTeam
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get the head coach's email
    const { data: teamData } = await supabase
      .from("teams")
      .select("code, head_coach_id")
      .eq("name", similarTeam.name)
      .single();

    if (!teamData) {
      throw new Error("Team not found");
    }

    // Get head coach's email
    const { data: headCoach } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", teamData.head_coach_id)
      .single();

    if (!headCoach) {
      throw new Error("Head coach not found");
    }

    // Update user's profile to not approved
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_approved: false })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Failed to update user status");
    }

    // TODO: Implement the email notification for coach team request.
    console.log("Team Access Request Details:", {
      toEmail: headCoach.email,
      teamName: similarTeam.name,
      requestingCoachEmail: user.email,
      teamCode: teamData.code,
    });

    // Redirect to oauth
    redirect("/oauth");
  } catch (error) {
    console.error("Error requesting team access:", error);
    throw new Error("Failed to send access request");
  }
}
