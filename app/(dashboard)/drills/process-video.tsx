"use server";

import { DrillFormSchemaType } from "@/components/drills/forms/manual/validation";
import { processAndAnalyzeVideo } from "@/lib/gemini/client";
import { downloadYouTubeVideo } from "@/lib/video-processing/youtube";
import { unlink } from "fs/promises";

export async function processVideo(
  videoUrl: string,
  platform: string
): Promise<DrillFormSchemaType | null> {
  try {
    let videoPath: string;

    if (platform === "youtube") {
      videoPath = await downloadYouTubeVideo(videoUrl);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const analysisResult = await processAndAnalyzeVideo(videoPath);

    // Clean up the temporary video file
    await unlink(videoPath);

    // Add the video URL to the result
    return {
      ...analysisResult,
      video_url: videoUrl,
    };
  } catch (error) {
    console.error("Error processing video:", error);
    return null;
  }
}
