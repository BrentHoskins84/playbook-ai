import { processVideo } from "@/app/(dashboard)/drills/process-video";
import { getProfile } from "@/lib/services/user-service";
import { NextRequest } from "next/server";
import { z } from "zod";

// Request validation schema
const requestSchema = z.object({
  url: z.string().url(),
  platform: z.string(),
});

type ProgressWriter = (stage: string, progress: number) => Promise<void>;

async function simulateProgress(
  writeProgress: ProgressWriter,
  stage: string,
  start: number,
  end: number
) {
  const steps = 5;
  const increment = (end - start) / steps;

  for (let i = 0; i <= steps; i++) {
    await writeProgress(stage, Math.min(start + i * increment, end));
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user's profile
    const profile = await getProfile();
    if (!profile?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const { url, platform } = requestSchema.parse(body);

    // Set up streaming
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const writeProgress: ProgressWriter = async (stage, progress) => {
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ stage, progress })}\n\n`)
      );
    };

    // Start processing in the background
    (async () => {
      try {
        await writeProgress("Downloading video", 0);
        await simulateProgress(writeProgress, "Downloading video", 0, 33);

        await writeProgress("Processing video", 33);
        await simulateProgress(writeProgress, "Processing video", 33, 66);

        await writeProgress("Analyzing video", 66);
        const result = await processVideo(url, platform);

        if (result) {
          // Add the user ID and timestamps to the result
          const completeResult = {
            ...result,
            created_by: profile.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ result: completeResult })}\n\n`
            )
          );
        } else {
          console.log("Failed to process video(route.ts:79): No result");
          throw new Error("Failed to process video");
        }

        await writeProgress("Analysis complete", 100);
      } catch (error) {
        console.error("Processing error:", error);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to process video",
            })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    // Return the readable stream
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return Response.json(
      { error: "Invalid request parameters" },
      { status: 400 }
    );
  }
}
