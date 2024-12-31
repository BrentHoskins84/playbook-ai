"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  HelpCircle,
  Home,
  Settings,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  isSheet?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Team", href: "/teams", icon: Users },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Practice Plans", href: "/practice-plans", icon: ClipboardList },
  { name: "Drills", href: "/drills", icon: BookOpen },
];

const accountPages = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Team Settings", href: "/team-settings", icon: Settings },
];

export function DashboardNav({ isSheet, onClose }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "sidebar z-50",
        isSheet && "static shadow-none rounded-none"
      )}
    >
      {/* Logo */}
      <div className="px-8 py-8">
        <Image
          src="/logos/Playbook-AI-Black-Logo.webp"
          alt="Playbook AI"
          width={150}
          height={32}
          priority
        />
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="sidebar-footer">
          {accountPages.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}

          <Button
            variant="outline"
            className="w-full justify-start mt-6"
            asChild
          >
            <Link href="/docs" onClick={onClose}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Documentation
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
