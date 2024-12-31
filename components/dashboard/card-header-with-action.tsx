// components/dashboard/card-header-with-action.tsx
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CardHeaderWithActionProps {
  title: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function CardHeaderWithAction({
  title,
  actionHref,
  onActionClick,
}: CardHeaderWithActionProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <Button
        variant="ghost"
        className="text-primary hover:text-primary/80 px-2 h-8"
        onClick={onActionClick}
        asChild={Boolean(actionHref)}
      >
        {actionHref ? (
          <a href={actionHref} className="flex items-center">
            See all <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        ) : (
          <span className="flex items-center">
            See all <ChevronRight className="ml-1 h-4 w-4" />
          </span>
        )}
      </Button>
    </CardHeader>
  );
}
