import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FairUseDisclaimer } from "./fair-use-disclaimer";
import { PLATFORMS, PlatformSelect } from "./platform-select";
import { ProgressIndicator } from "./progress-indicator";
import { VideoSubmissionProps } from "./types";
import { useVideoProcessing } from "./use-video-processing";

export function VideoSubmission({
  onProcessingComplete,
  onError,
}: VideoSubmissionProps) {
  const {
    url,
    setUrl,
    platform,
    setPlatform,
    stage,
    progress,
    error,
    isLoading,
    handleVideoProcessing,
  } = useVideoProcessing(onProcessingComplete, onError);

  const selectedPlatform = platform as keyof typeof PLATFORMS;
  const isPlatformAvailable = PLATFORMS[selectedPlatform]?.isAvailable;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) {
      onError("Please select a video platform");
      return;
    }
    if (!url) {
      onError("Please enter a video URL");
      return;
    }
    handleVideoProcessing();
  };

  if (isLoading) {
    return <ProgressIndicator stage={stage} progress={progress} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <PlatformSelect platform={platform} onPlatformChange={setPlatform} />

      {platform && isPlatformAvailable && (
        <>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Paste a URL to a {PLATFORMS[selectedPlatform].label} video
              (limited to 3 minutes).
            </p>
            <Input
              type="url"
              placeholder="Video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <FairUseDisclaimer />
          </div>

          <Button type="submit" disabled={isLoading || !url}>
            {isLoading ? "Processing..." : "Extract Drill Information"}
          </Button>
        </>
      )}

      {error && (
        <div
          className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </form>
  );
}
