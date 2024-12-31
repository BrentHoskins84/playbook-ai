"use server";

import ytdl from "@distube/ytdl-core";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export async function downloadYouTubeVideo(url: string): Promise<string> {
  console.log("downloadYouTubeVideo", url);
  const videoID = ytdl.getVideoID(url);
  console.log("videoID", videoID);
  const tempDir = join(process.cwd(), "temp");

  console.log("tempDir", tempDir);

  try {
    await mkdir(tempDir, { recursive: true });

    const outputPath = join(tempDir, `${videoID}.mp4`);
    const videoStream = ytdl(url, { filter: "videoandaudio" });

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of videoStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await writeFile(outputPath, buffer);
    return outputPath;
  } catch (error) {
    console.error("Error downloading video:", error);
    throw error;
  }
}
