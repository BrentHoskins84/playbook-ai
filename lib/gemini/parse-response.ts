import {
  DrillCategory,
  DrillStatus,
  SkillLevel,
  SpaceRequired,
} from "@/components/drills/forms/manual/types";
import { z } from "zod";

// Error type definition
type DrillParseError = Error & {
  originalError?: unknown;
};

// Create error utility function
function createDrillParseError(
  message: string,
  originalError?: unknown
): DrillParseError {
  const error = new Error(message) as DrillParseError;
  error.name = "DrillParseError";
  error.originalError = originalError;
  return error;
}

// Zod schemas
const teachingPointsSchema = z.object({
  main_points: z.array(z.string()),
  setup: z.array(z.string()),
  execution: z.array(z.string()),
  coaching_cues: z.array(z.string()),
});

const drillDetailsSchema = z.object({
  title: z.string(),
  description: z.string(),
  primary_category: z.nativeEnum(DrillCategory),
  skill_level: z.nativeEnum(SkillLevel),
  required_equipment: z.array(z.string()),
  duration_minutes: z.number().min(1).max(120),
  player_count_min: z.number().min(1).max(50),
  player_count_max: z.number().min(1).max(50),
  space_required: z.nativeEnum(SpaceRequired),
  teaching_points: teachingPointsSchema,
});

const confidenceScoresSchema = z.object({
  overall: z.number(),
  category: z.number(),
  equipment: z.number(),
  players: z.number(),
});

const aiMetadataSchema = z.object({
  analysis_version: z.string(),
  confidence_scores: confidenceScoresSchema,
  detected_equipment: z.string().or(z.array(z.string())),
  detected_movements: z.array(z.unknown()),
  last_analyzed: z.string(),
});

const apiResponseSchema = z.object({
  video_url: z.string(),
  created_by: z.string(),
  ai_metadata: aiMetadataSchema,
  status: z.nativeEnum(DrillStatus),
  created_at: z.string(),
  updated_at: z.string(),
});

// Type exports
export type DrillDetails = z.infer<typeof drillDetailsSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Parse the raw Gemini response
export function parseGeminiResponse(text: string): DrillDetails {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw createDrillParseError("No JSON object found in Gemini response");
    }

    const drillDetailsJson = JSON.parse(jsonMatch[0]);
    return drillDetailsSchema.parse(drillDetailsJson);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createDrillParseError("Invalid drill details structure", error);
    }
    if (error instanceof SyntaxError) {
      throw createDrillParseError("Invalid JSON in Gemini response", error);
    }
    throw createDrillParseError("Failed to parse Gemini response", error);
  }
}

// Construct the drill response
export function constructDrillResponse(
  drillDetails: DrillDetails,
  videoUrl: string
): ApiResponse {
  return {
    video_url: videoUrl,
    created_by: "",
    ai_metadata: {
      analysis_version: "1.0",
      confidence_scores: {
        overall: 0.85,
        category: 0.9,
        equipment: 0.8,
        players: 0.85,
      },
      detected_equipment: JSON.stringify(drillDetails, null, 2),
      detected_movements: [],
      last_analyzed: new Date().toISOString(),
    },
    status: DrillStatus.draft,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Main parse function
export function parseDrillResponse(
  apiResponse: unknown
): DrillDetails & Pick<ApiResponse, "video_url" | "status" | "created_at"> {
  try {
    const validatedResponse = apiResponseSchema.parse(apiResponse);

    const detectedEquipment =
      typeof validatedResponse.ai_metadata.detected_equipment === "string"
        ? parseGeminiResponse(validatedResponse.ai_metadata.detected_equipment)
        : drillDetailsSchema.parse(
            validatedResponse.ai_metadata.detected_equipment
          );

    return {
      ...detectedEquipment,
      video_url: validatedResponse.video_url,
      status: validatedResponse.status,
      created_at: validatedResponse.created_at,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createDrillParseError("Invalid data structure", error);
    }
    throw createDrillParseError("Failed to parse drill response", error);
  }
}

// Type guard for checking DrillParseError
export function isDrillParseError(error: unknown): error is DrillParseError {
  return error instanceof Error && error.name === "DrillParseError";
}
