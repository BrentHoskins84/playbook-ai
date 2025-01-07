"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A1228]">
      {/* Hero Section */}
      <div className="px-5 mt-7">
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
          <Navbar />
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
