import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { TeamInfoModalWrapper } from "@/components/team-info-modal-wrapper"
import Image from "next/image"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  // First, get the team ID from user_teams table
  const { data: userTeamData } = await supabase
    .from("user_teams")
    .select("team_id")
    .eq("user_id", user.id)
    .single()

  let teamData = null
  let needsTeamInfo = false

  if (userTeamData?.team_id) {
    // If user is associated with a team, fetch team data
    const { data: fetchedTeamData } = await supabase
      .from("teams")
      .select("id, team_name, total_players, team_level")
      .eq("id", userTeamData.team_id)
      .single()

    teamData = fetchedTeamData
    needsTeamInfo = teamData && (teamData.total_players === null || teamData.team_level === null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="absolute inset-0 bg-[#1A2229] h-[350px]">
        <Image
          src="/images/wave-bg.png"
          alt="Wave background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-20"
          priority
        />
      </div>
      <div className="relative z-10 flex gap-6 p-6">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-[calc(100vh-3rem)]">
          <div className="h-24 flex items-center">
            <Header user={user} pageTitle="Dashboard" />
          </div>
          <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {needsTeamInfo && teamData ? (
              <TeamInfoModalWrapper teamId={teamData.id} teamName={teamData.team_name} />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
