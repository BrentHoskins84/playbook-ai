// forms/video-submission/types.ts
import {
  AIMetadata,
  DrillCategoryType,
  DrillFormData,
  SkillLevelType,
  SpaceRequiredType,
  TeachingPoints,
} from "../manual/types";

export interface VideoSubmissionProps {
  onProcessingComplete: (data: Partial<DrillFormData>) => void;
  onError: (error: string) => void;
}

export interface VideoProcessingState {
  url: string;
  platform: string;
  stage: string;
  progress: number;
  error: string | null;
  isLoading: boolean;
}

export interface VideoProcessingHookReturn extends VideoProcessingState {
  setUrl: (url: string) => void;
  setPlatform: (platform: string) => void;
  handleVideoProcessing: () => Promise<void>;
}

// Types for the video processing API
export interface VideoProcessingProgress {
  stage: string;
  progress: number;
}

export interface VideoProcessingResult {
  created_by: string;
  created_at: string;
  updated_at: string;
  // Include all the fields that match our DrillFormData
  title: string;
  description: string;
  video_url: string;
  primary_category: DrillCategoryType;
  skill_level: SkillLevelType;
  required_equipment: string[];
  duration_minutes: number;
  player_count_min: number;
  player_count_max: number;
  space_required: SpaceRequiredType;
  teaching_points: TeachingPoints;
  ai_metadata: AIMetadata | null;
  status: "draft" | "published" | "archived";
  tags: string[];
}

export type VideoProcessingResponse = {
  stage?: string;
  progress?: number;
  result?: VideoProcessingResult;
  error?: string;
};

export interface VideoProcessingRequest {
  url: string;
  platform: string;
}
