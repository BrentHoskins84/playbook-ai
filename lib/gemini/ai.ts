import {
  DrillCategory,
  DrillStatus,
  SkillLevel,
  SpaceRequired,
} from "@/components/drills/forms/manual/types";
import { DrillFormSchemaType } from "@/components/drills/forms/manual/validation";
import {
  GenerativeModel,
  GoogleGenerativeAI,
  Part,
} from "@google/generative-ai";
import { FileMetadataResponse } from "@google/generative-ai/dist/server/server";
import { deleteFile } from "./file-manager";
import { parseGeminiResponse } from "./parse-response";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export async function analyzeVideo(
  fileUri: FileMetadataResponse
): Promise<DrillFormSchemaType> {
  const prompt = `Analyze this softball drill video and provide detailed information in the following format:
  
  {
    "title": "Brief, descriptive title of the drill",
    "description": "Detailed description of the drill",
    "primary_category": One of ${JSON.stringify(Object.values(DrillCategory))},
    "skill_level": One of ${JSON.stringify(Object.values(SkillLevel))},
    "required_equipment": ["equipment1", "equipment2", ...],
    "duration_minutes": estimated duration in minutes (1-120),
    "player_count_min": minimum number of players needed (1-50),
    "player_count_max": maximum number of players recommended (1-50),
    "space_required": One of ${JSON.stringify(Object.values(SpaceRequired))},
    "teaching_points": {
      "main_points": ["main point 1", "main point 2", ...],
      "setup": ["setup step 1", "setup step 2", ...],
      "execution": ["execution step 1", "execution step 2", ...],
      "coaching_cues": ["cue 1", "cue 2", ...]
    }
  }
  
  Please provide detailed and specific information based on what you can see in the video.
  Focus on actionable coaching points and clear instructions. Ensure all fields are filled with appropriate values.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          mimeType: fileUri.mimeType,
          fileUri: fileUri.uri,
        },
      } as Part,
    ]);

    const drillDetails = parseGeminiResponse(result.response.text());

    await deleteFile(fileUri.name);

    //@ts-ignore
    return {
      video_url: fileUri.uri,
      ...drillDetails,
      created_by: "",
      ai_metadata: {
        analysis_version: "1.0",
        confidence_scores: {
          overall: 0.85,
          category: 0.9,
          equipment: 0.8,
          players: 0.85,
        },
        detected_equipment: result.response.text().split(","),
        detected_movements: [],
        last_analyzed: new Date().toISOString(),
      },
      status: DrillStatus.draft,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error(
      "Failed to analyze video content. Please try again or contact support if the issue persists."
    );
  }
}
