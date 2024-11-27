'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LayoutDashboard, ClipboardList, Calendar, Users } from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Drills', href: '/drills', icon: ClipboardList },
  { name: 'Practice Plans', href: '/practice-plans', icon: Calendar },
  { name: 'Teams', href: '/teams', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 shrink-0">
      <div className="fixed w-64 h-[calc(100vh-3rem)] bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Playbook AI</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <nav className="grid gap-1 p-4">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start h-12",
                      isActive && "bg-blue-100 text-blue-600"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

