"use client";

import { AddDrillModal } from "@/components/drills/add-drill-modal";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type Database } from "@/types/supabase";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { UserNav } from "../navigation/user-nav";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
  profile: Profile | null;
}

export function DashboardHeader({
  title,
  children,
  profile,
}: DashboardHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 z-[49]">
      <div
        className={cn(
          "w-full transition-all duration-200",
          scrolled
            ? "dark:bg-[#0B1120]/95 light:bg-[#0B1120]/95 shadow-sm backdrop-blur-sm"
            : "bg-transparent"
        )}
      >
        <div className="px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex flex-col space-y-1">
                <h1 className="text-xl font-semibold dark:text-white light:text-blue-100">
                  {title}
                </h1>
                {children && (
                  <div className="text-sm text-white/60">{children}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AddDrillModal />
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[240px] pl-9 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/40 border-input bg-background text-foreground"
                />
              </div>
              <ThemeSwitcher />
              <UserNav profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
