import type { User } from "@supabase/supabase-js";

// Application specific interfaces
interface TeamSettings {
  ageGroup: string | null;
  teamLevel: string | null;
  isActive: boolean;
  totalPlayers: number | null;
  activePlayers: number | null;
}

interface TeamSeason {
  startDate: string | null;
  endDate: string | null;
  goals: any[]; // Type this based on your actual data structure
  skillFocusAreas: any[];
}

interface TeamFacilities {
  availableEquipment: any[];
  indoorFacilityAccess: boolean;
  typicalPracticeDuration: number | null;
}

interface Team {
  id: string;
  name: string;
  code: string;
  role: string;
  settings: TeamSettings;
  season: TeamSeason;
  facilities: TeamFacilities;
}

// Auth and Permissions interfaces
interface UserPermissions {
  isAdmin: boolean;
  isApproved: boolean;
  isVerified: boolean;
  isCoach: boolean;
}

// Updated ExtendedUser interface that extends Supabase User
export interface ExtendedUser extends User {
  // Profile data from user_metadata
  fullName: string;
  avatarUrl: string;

  // Timestamps come from base User
  auth: {
    createdAt: string;
    updatedAt: string;
  };

  // Application permissions
  permissions: UserPermissions;

  // Optional team data
  team?: Team;
}

// Export other types that might be needed elsewhere
export type { Team, TeamSettings, TeamSeason, TeamFacilities, UserPermissions };

// Type for the get_user function response
export interface GetUserResponse {
  permissions: Omit<UserPermissions, "isCoach">;
  team?: Team;
}
