import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RocketIcon } from "lucide-react";

export const PLATFORMS = {
  youtube: {
    label: "YouTube",
    isAvailable: true,
  },
  facebook: {
    label: "Facebook",
    isAvailable: false,
  },
  tiktok: {
    label: "TikTok",
    isAvailable: false,
  },
  instagram: {
    label: "Instagram",
    isAvailable: false,
  },
} as const;

export type PlatformKey = keyof typeof PLATFORMS;

interface PlatformSelectProps {
  platform: string;
  onPlatformChange: (platform: string) => void;
}

export function PlatformSelect({
  platform,
  onPlatformChange,
}: PlatformSelectProps) {
  const selectedPlatform = platform as PlatformKey;
  const isPlatformAvailable = PLATFORMS[selectedPlatform]?.isAvailable;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the platform where your video is hosted.
      </p>

      <Select onValueChange={onPlatformChange} value={platform}>
        <SelectTrigger>
          <SelectValue placeholder="Select video platform" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PLATFORMS).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {platform && !isPlatformAvailable && (
        <Alert className="bg-primary/10 border-primary/20">
          <RocketIcon className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            {PLATFORMS[selectedPlatform].label} integration is coming soon!
            We're working hard to bring you more video platforms.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
