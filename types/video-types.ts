export interface FacebookVideoInfo {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnailUrl: string;
}

export interface VideoProcessingOptions {
  url: string;
  platform: "youtube" | "facebook";
}

export interface VideoProcessingResult {
  frames: string[];
}
