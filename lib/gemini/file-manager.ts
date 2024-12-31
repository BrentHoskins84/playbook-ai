import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

export async function uploadVideo(
  videoContent: string,
  mimeType: string,
  displayName: string
): Promise<any> {
  try {
    const uploadResponse = await fileManager.uploadFile(videoContent, {
      mimeType,
      displayName,
    });

    let file = await fileManager.getFile(uploadResponse.file.name);
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      file = await fileManager.getFile(uploadResponse.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed.");
    }

    return file;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw new Error("Failed to upload video. Please try again.");
  }
}

export async function deleteFile(fileName: string): Promise<void> {
  try {
    await fileManager.deleteFile(fileName);
  } catch (error) {
    console.error("Error deleting file:", error);
    // We're not throwing here because failing to delete shouldn't break the main flow
    // But we log it for monitoring purposes
  }
}
