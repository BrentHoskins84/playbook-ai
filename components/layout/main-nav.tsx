"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, Users, LayoutDashboard } from "lucide-react"

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/drills",
    label: "Drills",
    icon: ClipboardList,
  },
  {
    href: "/practice-plans",
    label: "Practice Plans",
    icon: Calendar,
  },
  {
    href: "/teams",
    label: "Teams",
    icon: Users,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Button
            key={route.href}
            asChild
            variant={pathname === route.href ? "default" : "ghost"}
            className="justify-start"
          >
            <Link href={route.href}>
              <Icon className="h-4 w-4 mr-2" />
              {route.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}