import { z } from "zod";
import { DrillCategory, SkillLevel, SpaceRequired } from "./types";

// AI-specific teaching points schema - more permissive
const aiTeachingPointsSchema = z
  .object({
    main_points: z.array(z.string()).optional(),
    setup: z.array(z.string()).optional(),
    execution: z.array(z.string()).optional(),
    coaching_cues: z.array(z.string()).optional(),
  })
  .optional();

// Strict teaching points schema for form submission
const teachingPointsSchema = z
  .object({
    main_points: z
      .array(z.string().min(1, "Teaching point cannot be empty"))
      .min(1, "At least one main teaching point is required"),
    setup: z
      .array(z.string().min(1, "Setup instruction cannot be empty"))
      .min(1, "At least one setup instruction is required"),
    execution: z
      .array(z.string().min(1, "Execution step cannot be empty"))
      .min(1, "At least one execution step is required"),
    coaching_cues: z.array(z.string().min(1, "Coaching cue cannot be empty")),
  })
  .strict();

// AI metadata schema remains the same as it's already nullable
const aiMetadataSchema = z
  .object({
    analysis_version: z.string().nullable(),
    confidence_scores: z.record(z.number()),
    detected_equipment: z.array(z.string()),
    detected_movements: z.array(z.string()),
    last_analyzed: z.string().nullable(),
  })
  .nullable();

// Schema for validating AI-generated data - intentionally permissive
export const aiDrillSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    video_url: z.string().nullable().optional(),
    primary_category: z.string().optional(),
    skill_level: z.string().optional(),
    duration_minutes: z.number().optional(),
    player_count_min: z.number().optional(),
    player_count_max: z.number().optional(),
    space_required: z.string().optional(),
    teaching_points: aiTeachingPointsSchema,
    ai_metadata: z.any().optional(),
    required_equipment: z.array(z.string()).optional(),
    status: z.string().optional(),
  })
  .passthrough(); // Allow additional fields we might not expect

// Main drill form validation schema - maintains existing strict validation
export const drillFormSchema = z
  .object({
    // Basic Information
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Description must be less than 2000 characters"),
    video_url: z.string().url("Please enter a valid URL").nullable(),
    tags: z.array(z.string()).min(1, "At least one tag is required"),

    // Categorization
    primary_category: z.enum(
      Object.values(DrillCategory) as [string, ...string[]],
      {
        errorMap: () => ({ message: "Please select a valid category" }),
      }
    ),
    skill_level: z.enum(Object.values(SkillLevel) as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a valid skill level" }),
    }),

    // Requirements
    duration_minutes: z
      .number()
      .min(1, "Duration must be at least 1 minute")
      .max(120, "Duration cannot exceed 120 minutes"),
    player_count_min: z
      .number()
      .min(1, "Minimum player count must be at least 1")
      .max(50, "Minimum player count cannot exceed 50"),
    player_count_max: z
      .number()
      .min(1, "Maximum player count must be at least 1")
      .max(50, "Maximum player count cannot exceed 50"),
    space_required: z.enum(
      Object.values(SpaceRequired) as [string, ...string[]],
      {
        errorMap: () => ({ message: "Please select required space" }),
      }
    ),
    required_equipment: z.array(z.string()),

    // Teaching Points
    teaching_points: teachingPointsSchema,

    // Metadata
    ai_metadata: aiMetadataSchema,
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    created_by: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .refine((data) => data.player_count_max >= data.player_count_min, {
    message: "Maximum players must be greater than or equal to minimum players",
    path: ["player_count_max"],
  });

// Type inference from schemas
export type DrillFormSchemaType = z.infer<typeof drillFormSchema>;
export type AIDrillSchemaType = z.infer<typeof aiDrillSchema>;
