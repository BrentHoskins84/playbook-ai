import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function FairUseDisclaimer() {
  return (
    <Alert variant="default">
      <Info className="h-4 w-4" />
      <AlertTitle>Fair Use Disclaimer</AlertTitle>
      <AlertDescription>
        This tool is intended for educational purposes only. By using it, you
        acknowledge that:
        <ul className="list-disc list-inside mt-2">
          <li>
            You have the right to use the video content for educational
            purposes.
          </li>
          <li>The video analysis falls under Fair Use doctrine.</li>
          <li>We do not store or retain any video content after processing.</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
