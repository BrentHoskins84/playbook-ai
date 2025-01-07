"use client";

import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// Type definitions for our database tables
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type Team = Database["public"]["Tables"]["teams"]["Row"];

// Our extended user type that includes profile and team data
export interface ExtendedUser extends User {
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    is_admin: boolean;
    is_approved: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  team?: {
    id: string;
    name: string;
    role: string;
    code: string;
    is_active: boolean;
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
      // Fetch profile and team member data in parallel
      const [profileResponse, teamMemberResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", authUser.id).single(),
        supabase
          .from("team_members")
          .select(
            `
            *,
            team:teams (
              id,
              name,
              code,
              is_active
            )
          `
          )
          .eq("user_id", authUser.id)
          .single(),
      ]);

      if (profileResponse.error) {
        throw new UserDataError(
          `Failed to fetch profile: ${profileResponse.error.message}`
        );
      }

      const profile = profileResponse.data;
      const teamMember = teamMemberResponse.data;

      const extendedUser: ExtendedUser = {
        ...authUser,
        profile: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          is_admin: profile.is_admin ?? false,
          is_approved: profile.is_approved ?? false,
          is_verified: profile.is_verified ?? false,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
        isAdmin: profile.is_admin ?? false,
        isCoach: !!teamMember?.role,
      };

      // Add team information if it exists
      if (teamMember?.team) {
        extendedUser.team = {
          id: teamMember.team.id,
          name: teamMember.team.name,
          role: teamMember.role,
          code: teamMember.team.code,
          is_active: teamMember.team.is_active ?? false,
        };
      }

      return extendedUser;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch user data");
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

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
    // Initial user load
    refreshUser();

    // Subscribe to auth changes
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
                : new Error("Failed to fetch user data"),
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Create the context value object
  const contextValue: UserContextValue = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    refreshUser,
  };

  // Return the provider with our context value
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
