export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          id: string;
          ip_address: string | null;
          new_data: Json | null;
          old_data: Json | null;
          record_id: string;
          table_name: string;
          timestamp: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          id?: string;
          ip_address?: string | null;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id: string;
          table_name: string;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          id?: string;
          ip_address?: string | null;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id?: string;
          table_name?: string;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      drill_tags: {
        Row: {
          created_at: string;
          drill_id: string | null;
          id: string;
          tag: string;
        };
        Insert: {
          created_at?: string;
          drill_id?: string | null;
          id?: string;
          tag: string;
        };
        Update: {
          created_at?: string;
          drill_id?: string | null;
          id?: string;
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: "drill_tags_drill_id_fkey";
            columns: ["drill_id"];
            isOneToOne: false;
            referencedRelation: "drills";
            referencedColumns: ["id"];
          },
        ];
      };
      drills: {
        Row: {
          ai_metadata: Json | null;
          created_at: string;
          created_by: string | null;
          description: string;
          duration_minutes: number | null;
          id: string;
          last_used_in_plan_at: string | null;
          last_viewed_at: string | null;
          player_count_max: number | null;
          player_count_min: number | null;
          practice_plan_usage_count: number | null;
          primary_category: string;
          required_equipment: Json | null;
          skill_level: string;
          space_required: string | null;
          status: string | null;
          teaching_points: Json | null;
          title: string;
          updated_at: string;
          video_url: string;
          view_count: number | null;
        };
        Insert: {
          ai_metadata?: Json | null;
          created_at?: string;
          created_by?: string | null;
          description: string;
          duration_minutes?: number | null;
          id?: string;
          last_used_in_plan_at?: string | null;
          last_viewed_at?: string | null;
          player_count_max?: number | null;
          player_count_min?: number | null;
          practice_plan_usage_count?: number | null;
          primary_category: string;
          required_equipment?: Json | null;
          skill_level: string;
          space_required?: string | null;
          status?: string | null;
          teaching_points?: Json | null;
          title: string;
          updated_at?: string;
          video_url: string;
          view_count?: number | null;
        };
        Update: {
          ai_metadata?: Json | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          duration_minutes?: number | null;
          id?: string;
          last_used_in_plan_at?: string | null;
          last_viewed_at?: string | null;
          player_count_max?: number | null;
          player_count_min?: number | null;
          practice_plan_usage_count?: number | null;
          primary_category?: string;
          required_equipment?: Json | null;
          skill_level?: string;
          space_required?: string | null;
          status?: string | null;
          teaching_points?: Json | null;
          title?: string;
          updated_at?: string;
          video_url?: string;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "drills_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      practices: {
        Row: {
          coach_id: string;
          created_at: string | null;
          end_time: string;
          goals: string | null;
          id: string;
          start_time: string;
          status: string;
          team_id: string;
          updated_at: string | null;
        };
        Insert: {
          coach_id: string;
          created_at?: string | null;
          end_time: string;
          goals?: string | null;
          id?: string;
          start_time: string;
          status?: string;
          team_id: string;
          updated_at?: string | null;
        };
        Update: {
          coach_id?: string;
          created_at?: string | null;
          end_time?: string;
          goals?: string | null;
          id?: string;
          start_time?: string;
          status?: string;
          team_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "practices_coach_id_fkey";
            columns: ["coach_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "practices_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          is_admin: boolean | null;
          is_approved: boolean | null;
          is_verified: boolean | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          is_admin?: boolean | null;
          is_approved?: boolean | null;
          is_verified?: boolean | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          is_approved?: boolean | null;
          is_verified?: boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          team_id: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: string;
          team_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          team_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          active_players: number | null;
          age_group: string | null;
          available_equipment: Json | null;
          code: string;
          created_at: string;
          description: string | null;
          head_coach_id: string;
          id: string;
          indoor_facility_access: boolean | null;
          is_active: boolean | null;
          name: string;
          season_end_date: string | null;
          season_goals: Json | null;
          season_start_date: string | null;
          skill_focus_areas: Json | null;
          team_level: string | null;
          total_players: number | null;
          typical_practice_duration: number | null;
          updated_at: string;
        };
        Insert: {
          active_players?: number | null;
          age_group?: string | null;
          available_equipment?: Json | null;
          code: string;
          created_at?: string;
          description?: string | null;
          head_coach_id: string;
          id?: string;
          indoor_facility_access?: boolean | null;
          is_active?: boolean | null;
          name: string;
          season_end_date?: string | null;
          season_goals?: Json | null;
          season_start_date?: string | null;
          skill_focus_areas?: Json | null;
          team_level?: string | null;
          total_players?: number | null;
          typical_practice_duration?: number | null;
          updated_at?: string;
        };
        Update: {
          active_players?: number | null;
          age_group?: string | null;
          available_equipment?: Json | null;
          code?: string;
          created_at?: string;
          description?: string | null;
          head_coach_id?: string;
          id?: string;
          indoor_facility_access?: boolean | null;
          is_active?: boolean | null;
          name?: string;
          season_end_date?: string | null;
          season_goals?: Json | null;
          season_start_date?: string | null;
          skill_focus_areas?: Json | null;
          team_level?: string | null;
          total_players?: number | null;
          typical_practice_duration?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teams_head_coach_id_fkey";
            columns: ["head_coach_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_similar_team_names:
        | {
            Args: {
              team_name: string;
              max_distance: number;
            };
            Returns: {
              name: string;
              distance: number;
            }[];
          }
        | {
            Args: {
              team_name: string;
              similarity_threshold: number;
            };
            Returns: {
              name: string;
              similarity: number;
            }[];
          };
      get_user: {
        Args: {
          input_user_id: string;
        };
        Returns: Json;
      };
      gtrgm_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: {
          "": unknown;
        };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      set_limit: {
        Args: {
          "": number;
        };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: {
          "": string;
        };
        Returns: string[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
