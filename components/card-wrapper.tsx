import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title?: string;
  icon?: LucideIcon;
  className?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  colSpan?: number;
}

export function DashboardCard({
  title,
  icon: Icon,
  className,
  headerAction,
  children,
  colSpan,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "bg-card text-card-foreground border-border",
        "dark:bg-white/[0.02] dark:border-white/[0.05] dark:backdrop-blur-sm",
        "shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        colSpan && `col-span-${colSpan}`,
        className
      )}
    >
      {(title || Icon || headerAction) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          {title && (
            <CardTitle className="text-xs font-medium tracking-wider dark:text-blue-100/70 light:text-blue-100/70 uppercase">
              {title}
            </CardTitle>
          )}
          {headerAction}
          {Icon && <Icon className="h-4 w-4 text-white/40" />}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
