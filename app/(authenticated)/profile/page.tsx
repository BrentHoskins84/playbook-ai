import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/signin")
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("full_name, role")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Error fetching user profile:", profileError)
    // Handle error appropriately
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Profile</h1>
      <ProfileForm user={user} profile={profile} />
    </div>
  )
}
