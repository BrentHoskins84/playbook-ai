"use client";

import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// Use existing types from Supabase
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type Team = Database["public"]["Tables"]["teams"]["Row"];

// Extend the User type with our profile and team data
export interface ExtendedUser extends User {
  profile: Profile;
  team?: {
    id: string;
    name: string;
    role: string;
    code: string;
    is_active: boolean;
    head_coach_id: string;
    age_group: string | null;
    team_level: string | null;
    total_players: number | null;
    active_players: number | null;
    season_start_date: string | null;
    season_end_date: string | null;
    season_goals: Team["season_goals"];
    skill_focus_areas: Team["skill_focus_areas"];
    available_equipment: Team["available_equipment"];
    indoor_facility_access: boolean | null;
    typical_practice_duration: number | null;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  isAdmin: boolean;
  isCoach: boolean;
}

// Define our context state and value interfaces
interface UserContextState {
  user: ExtendedUser | null;
  loading: boolean;
  error: Error | null;
}

interface UserContextValue extends UserContextState {
  refreshUser: () => Promise<void>;
}

// Create our context with undefined as the default value
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Custom error class for user data fetching errors
class UserDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserDataError";
  }
}

// Provider component props type
interface UserProviderProps {
  children: React.ReactNode;
}

// Provider component implementation
export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [state, setState] = useState<UserContextState>({
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  const fetchUserData = async (authUser: User): Promise<ExtendedUser> => {
    try {
      const { data, error } = await supabase.rpc("get_user", {
        input_user_id: authUser.id,
      });

      if (error) {
        throw new UserDataError(`Failed to fetch user data: ${error.message}`);
      }

      if (!data) {
        throw new UserDataError("User data not found");
      }

      return data as ExtendedUser;
    } catch (error) {
      throw new UserDataError(`Failed to fetch user data: ${error}`);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new UserDataError(`Auth error: ${authError.message}`);
      }

      if (!authUser) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      const extendedUser = await fetchUserData(authUser);
      setState({ user: extendedUser, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      }));
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        if (!session?.user) {
          setState({ user: null, loading: false, error: null });
          return;
        }

        try {
          const extendedUser = await fetchUserData(session.user);
          setState({ user: extendedUser, loading: false, error: null });
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error("Unknown error occurred"),
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const contextValue: UserContextValue = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    refreshUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Hook to consume the context
export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
