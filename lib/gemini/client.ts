import { DrillFormSchemaType } from "@/components/drills/forms/manual/validation";
import { FileMetadataResponse } from "@google/generative-ai/dist/server/server";
import { analyzeVideo } from "./ai";
import { uploadVideo } from "./file-manager";

export async function processAndAnalyzeVideo(
  videoPath: string
): Promise<DrillFormSchemaType> {
  let fileUri: FileMetadataResponse;
  try {
    // TODO: FIX THIS
    fileUri = await uploadVideo(videoPath, "video/mp4", "drill-video");
    const analysisResult = await analyzeVideo(fileUri);
    return analysisResult;
  } catch (error) {
    console.error("Error in processAndAnalyzeVideo:", error);
    throw new Error(
      "Failed to process and analyze video. Please try again or contact support if the issue persists."
    );
  }
}
