import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/auth/signin")
    }

    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="container py-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    redirect("/auth/signin")
  }
}
