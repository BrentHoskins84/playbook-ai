"use client";

import { ThemeSwitcher } from "@/components/theme-switcher"; // Import the existing ThemeSwitcher
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A1228]">
      {/* Hero Section */}
      <div className="px-5 pt-5">
        <div className="w-full h-[40vh] bg-[#0A1228] rounded-[40px] relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/auth-background.webp"
              alt="Background Pattern"
              fill
              className="object-cover object-center w-full h-full opacity-30"
              sizes="100vw"
              priority
            />
          </div>

          {/* Navigation */}
          <header className="relative z-10">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex h-16 items-center justify-between px-4 mt-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logos/Playbook-AI-white-Logo.webp"
                    alt="Playbook AI"
                    width={150}
                    height={32}
                  />
                </div>
                <div className="flex items-center gap-4">
                  {/* Add custom styling to match the auth layout */}
                  <div className="[&_button]:text-white [&_button]:border-white/20 [&_button]:hover:bg-white/10">
                    <ThemeSwitcher />
                  </div>
                  <Button
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    SIGN IN / SIGN UP
                  </Button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* Main Content - Positioned to overlap hero */}
      <main className="flex-1 flex relative -mt-[15vh]">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="rounded-[20px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
