"use client";

import {
  DrillCategory,
  SkillLevel,
  SpaceRequired,
} from "@/components/drills/forms/manual/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function DrillsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Debounced search handler
  const handleSearch = useCallback(
    (value: string) => {
      startTransition(() => {
        const queryString = createQueryString("search", value);
        router.push(queryString ? `/drills?${queryString}` : "/drills");
      });
    },
    [router, createQueryString]
  );

  // Reset filters
  const handleReset = useCallback(() => {
    startTransition(() => {
      router.push("/drills");
    });
  }, [router]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drills..."
            className="pl-10"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <Select
          defaultValue={searchParams.get("category") ?? ""}
          onValueChange={(value) => {
            startTransition(() => {
              const queryString = createQueryString("category", value);
              router.push(queryString ? `/drills?${queryString}` : "/drills");
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {Object.entries(DrillCategory).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Skill Level Filter */}
        <Select
          defaultValue={searchParams.get("skillLevel") ?? ""}
          onValueChange={(value) => {
            startTransition(() => {
              const queryString = createQueryString("skillLevel", value);
              router.push(queryString ? `/drills?${queryString}` : "/drills");
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {Object.entries(SkillLevel).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Space Required Filter */}
        <Select
          defaultValue={searchParams.get("spaceRequired") ?? ""}
          onValueChange={(value) => {
            startTransition(() => {
              const queryString = createQueryString("spaceRequired", value);
              router.push(queryString ? `/drills?${queryString}` : "/drills");
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Space Required" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Space</SelectItem>
            {Object.entries(SpaceRequired).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key
                  .split("_")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters & Reset */}
      {searchParams.toString().length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {isPending ? "Updating results..." : "Showing filtered results"}
          </div>
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isPending}
            className="text-sm"
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
