import { useState } from "react";
import {
  VideoProcessingHookReturn,
  VideoProcessingRequest,
  VideoProcessingResponse,
} from "./types";

export function useVideoProcessing(
  onProcessingComplete: (data: any) => void,
  onError: (error: string) => void
): VideoProcessingHookReturn {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoProcessing = async () => {
    setIsLoading(true);
    setError(null);
    setStage("Initializing");
    setProgress(0);

    try {
      const requestBody: VideoProcessingRequest = {
        url,
        platform,
      };

      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process video");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to start processing");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6)) as VideoProcessingResponse;

              if (data.stage && typeof data.progress === "number") {
                setStage(data.stage);
                setProgress(data.progress);
              } else if (data.result) {
                onProcessingComplete(data.result);
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
              throw new Error("Failed to parse video analysis data");
            }
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setStage("Error occurred");
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    url,
    setUrl,
    platform,
    setPlatform,
    stage,
    progress,
    error,
    isLoading,
    handleVideoProcessing,
  };
}
