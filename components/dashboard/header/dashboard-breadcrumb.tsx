// components/dashboard/dashboard-breadcrumb.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Slash } from "lucide-react";
import { usePathname } from "next/navigation";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Remove leading slash and split into segments
  const segments = pathname.split("/").filter(Boolean);

  // Capitalize first letter of each segment
  const formatSegment = (segment: string) => {
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <Breadcrumb
      separator={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
    >
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {segments.map((segment, index) => (
          <BreadcrumbItem key={segment}>
            <BreadcrumbLink
              href={`/${segments.slice(0, index + 1).join("/")}`}
              className={index === segments.length - 1 ? "font-semibold" : ""}
            >
              {formatSegment(segment)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
