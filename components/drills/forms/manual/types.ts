import { Database } from "@/types/supabase";
import { z } from "zod";

// Base Supabase types
export type DrillRow = Database["public"]["Tables"]["drills"]["Row"];
type DrillInsert = Database["public"]["Tables"]["drills"]["Insert"];

export type DrillTagRow = Database["public"]["Tables"]["drill_tags"]["Row"];

// Define our strict types for JSON fields
export interface TeachingPoints {
  main_points: string[];
  setup: string[];
  execution: string[];
  coaching_cues: string[];
}

export interface AIMetadata {
  analysis_version: string | null;
  confidence_scores: Record<string, number>;
  detected_equipment: string[];
  detected_movements: string[];
  last_analyzed: string | null;
}

export const DrillStatus = {
  draft: "draft",
  published: "published",
  archived: "archived",
} as const;

export type DrillStatusType = (typeof DrillStatus)[keyof typeof DrillStatus];

// Category enums
export const DrillCategory = {
  hitting: "hitting",
  fielding: "fielding",
  pitching: "pitching",
  catching: "catching",
  baserunning: "baserunning",
  conditioning: "conditioning",
} as const;

export type DrillCategoryType =
  (typeof DrillCategory)[keyof typeof DrillCategory];

export const SkillLevel = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
  all: "all",
} as const;

export type SkillLevelType = (typeof SkillLevel)[keyof typeof SkillLevel];

export const SpaceRequired = {
  full_field: "full_field",
  half_field: "half_field",
  quarter_field: "quarter_field",
  batting_cage: "batting_cage",
  bullpen: "bullpen",
  indoor: "indoor",
} as const;

export type SpaceRequiredType =
  (typeof SpaceRequired)[keyof typeof SpaceRequired];

// Helper type to handle JSON fields
type JsonCompatible<T> = T extends object
  ? { [K in keyof T]: JsonCompatible<T[K]> }
  : T;

export type JsonTeachingPoints = JsonCompatible<TeachingPoints>;
export type JsonAIMetadata = JsonCompatible<AIMetadata>;

// Form data type that maintains compatibility with Supabase
export type DrillFormData = Omit<
  DrillInsert,
  | "id"
  | "created_at"
  | "updated_at"
  | "view_count"
  | "practice_plan_usage_count"
> & {
  tags: string[];
  teaching_points: JsonCompatible<TeachingPoints>;
  ai_metadata: JsonCompatible<AIMetadata> | null;
  primary_category: DrillCategoryType;
  skill_level: SkillLevelType;
  space_required: SpaceRequiredType;
};

// Props types
export interface DrillFormProps {
  initialData?: Partial<DrillFormData>;
  onSuccess?: (data: DrillRow) => void;
  onError?: (error: string) => void;
}

export interface StepStatus {
  isComplete: boolean;
  label: string;
}

// Form submission types
export interface FormSubmissionResponse {
  success: boolean;
  data?: DrillRow;
  error?: string;
  details?: z.ZodIssue[];
}

// create an interface that has drills and tags as keys
export interface DrillWithTags extends DrillRow {
  drill_tags: DrillTagRow[];
  tags: string[];
  teaching_points: JsonTeachingPoints;
  required_equipment: string[];
}
