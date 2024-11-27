import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: userRole, error } = await supabase
  .from('users')
  .select('role')
  .eq("id", user.id)
  .single()

  const role = userRole?.role

  if (role !== "admin") {
    redirect("/dashboard")
  }

  return <AdminDashboard />
}

