"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 28;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={cn(
        "w-full z-navigation transition-all duration-200",
        scrolled
          ? "fixed top-0 bg-background/80 backdrop-blur-md shadow-sm"
          : "absolute"
      )}
    >
      <div className="container mx-auto">
        <div
          className={cn(
            "flex h-16 items-center justify-between",
            scrolled ? "my-2" : "my-8"
          )}
        >
          <Link
            href="/"
            className="transition-transform duration-200 hover:scale-105"
          >
            <Image
              src={
                scrolled && theme.resolvedTheme !== "dark"
                  ? "/logos/Playbook-AI-Black-Logo.webp"
                  : "/logos/Playbook-AI-white-Logo.webp"
              }
              alt="Playbook AI"
              width={150}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div
              className={cn(
                scrolled
                  ? ""
                  : "[&_button]:text-white [&_button]:border-border/20 [&_button]:hover:bg-white/10"
              )}
            >
              <ThemeSwitcher />
            </div>

            <Button
              variant="outline"
              className={cn(
                "interactive",
                scrolled
                  ? "border-border hover:bg-accent"
                  : "text-dark-blue border-border/20 hover:bg-white/10"
              )}
            >
              <Link href="/oauth">SIGN IN / SIGN UP</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
