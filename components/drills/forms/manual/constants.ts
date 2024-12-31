import { DrillFormData, JsonAIMetadata, JsonTeachingPoints } from "./types";

// Default teaching points structure
export const DEFAULT_TEACHING_POINTS: JsonTeachingPoints = {
  main_points: [],
  setup: [],
  execution: [],
  coaching_cues: [],
};

// Default AI metadata structure
export const DEFAULT_AI_METADATA: JsonAIMetadata = {
  analysis_version: null,
  confidence_scores: {},
  detected_equipment: [],
  detected_movements: [],
  last_analyzed: null,
};

// Default form values
export const DEFAULT_FORM_VALUES: DrillFormData = {
  title: "",
  description: "",
  video_url: "",
  primary_category: "hitting",
  skill_level: "beginner",
  required_equipment: [],
  duration_minutes: 0,
  player_count_min: 1,
  player_count_max: 1,
  space_required: "full_field",
  teaching_points: DEFAULT_TEACHING_POINTS,
  ai_metadata: DEFAULT_AI_METADATA,
  status: "draft",
  tags: [],
  created_by: "",
};

// Form sections configuration
export const FORM_SECTIONS = [
  {
    id: "basic-info",
    label: "Basic Info",
    required: ["title", "description", "video_url", "tags"],
  },
  {
    id: "category",
    label: "Category",
    required: ["primary_category", "skill_level"],
  },
  {
    id: "requirements",
    label: "Requirements",
    required: [
      "duration_minutes",
      "player_count_min",
      "player_count_max",
      "space_required",
    ],
  },
  {
    id: "teaching",
    label: "Teaching",
    required: ["teaching_points"],
  },
];
