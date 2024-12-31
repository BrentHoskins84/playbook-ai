import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProgressIndicatorProps {
  stage: string;
  progress: number;
}

export function ProgressIndicator({ stage, progress }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full transition-all" />
          <p className="text-base font-medium text-center text-foreground">
            {stage}
          </p>
          <p className="text-sm text-center text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
}
