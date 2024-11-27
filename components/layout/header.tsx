'use client'

import { UserNav } from "./user-nav"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User
  pageTitle: string
}

export function Header({ user, pageTitle }: HeaderProps) {
  return (
    <div className="w-full text-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center text-sm">
            <span className="opacity-70">Pages</span>
            <span className="mx-2 opacity-70">/</span>
            <span>{pageTitle}</span>
          </div>
          <h1 className="text-2xl font-medium">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Type here..."
              className="pl-9 h-9 bg-white/10 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/20"
            />
          </div>
          <UserNav user={user} />
        </div>
      </div>
    </div>
  )
}

