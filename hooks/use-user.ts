"use client";

import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export interface ExtendedUser extends User {
  isAdmin: boolean;
  isCoach: boolean;
}

export function useUser() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        const { data: teamMember } = await supabase
          .from("team_members")
          .select("role")
          .eq("user_id", user.id)
          .single();

        const extendedUser: ExtendedUser = {
          ...user,
          isAdmin: profile?.is_admin || false,
          isCoach: !!teamMember?.role,
        };

        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          const { data: teamMember } = await supabase
            .from("team_members")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          const extendedUser: ExtendedUser = {
            ...session.user,
            isAdmin: profile?.is_admin || false,
            isCoach: !!teamMember?.role,
          };

          setUser(extendedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
