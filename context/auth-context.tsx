"use client";

import type { Database } from "@/types/supabase";
import { ExtendedUser } from "@/types/user";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

interface UserContextState {
  user: ExtendedUser | null;
  loading: boolean;
  error: Error | null;
}

interface UserContextValue extends UserContextState {
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

class UserDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserDataError";
  }
}

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [state, setState] = useState<UserContextState>({
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();
  const fetchingRef = useRef(false);

  const fetchUserData = async (authUser: User): Promise<void> => {
    if (fetchingRef.current) return;

    try {
      fetchingRef.current = true;
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.rpc("get_user", {
        input_user_id: authUser.id,
      });

      if (error) throw error;
      if (!data) throw new Error("No data returned from RPC call");

      const extendedUser: ExtendedUser = {
        // Base auth data from authUser
        ...authUser,

        // Profile data from authUser.user_metadata
        fullName: authUser.user_metadata.full_name,
        avatarUrl: authUser.user_metadata.avatar_url,

        // Auth timestamps from authUser
        auth: {
          createdAt: authUser.created_at,
          updatedAt: authUser.updated_at || authUser.created_at,
        },

        // Permissions combining both sources
        permissions: {
          isAdmin: data.permissions.isAdmin,
          isApproved: data.permissions.isApproved,
          isVerified: data.permissions.isVerified,
          isCoach: !!data.team,
        },

        // Team data from our database
        team: data.team
          ? {
              id: data.team.id,
              name: data.team.name,
              code: data.team.code,
              role: data.team.role,
              settings: {
                ageGroup: data.team.settings.ageGroup,
                teamLevel: data.team.settings.teamLevel,
                isActive: data.team.settings.isActive,
                totalPlayers: data.team.settings.totalPlayers,
                activePlayers: data.team.settings.activePlayers,
              },
              season: {
                startDate: data.team.season.startDate,
                endDate: data.team.season.endDate,
                goals: data.team.season.goals,
                skillFocusAreas: data.team.season.skillFocusAreas,
              },
              facilities: {
                availableEquipment: data.team.facilities.availableEquipment,
                indoorFacilityAccess: data.team.facilities.indoorFacilityAccess,
                typicalPracticeDuration:
                  data.team.facilities.typicalPracticeDuration,
              },
            }
          : undefined,
      };

      setState({ user: extendedUser, loading: false, error: null });
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      }));
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          // Initial fetch outside the auth listener
          await fetchUserData(session.user);
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error in initialize:", error);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error("Failed to initialize auth"),
          }));
        }
      }
    };

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (!session?.user) {
          setState({ user: null, loading: false, error: null });
          return;
        }

        // Schedule the fetch outside of the callback
        setTimeout(() => {
          if (mounted) {
            fetchUserData(session.user);
          }
        }, 0);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async (): Promise<void> => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await fetchUserData(authUser);
    } else {
      setState({ user: null, loading: false, error: null });
    }
  };

  const contextValue: UserContextValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      refreshUser,
    }),
    [state.user, state.loading, state.error, refreshUser]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
