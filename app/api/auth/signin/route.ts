import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = createClient()

  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Fetch user status from the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('status, is_active, role')
    .eq('id', user.id)
    .single()

  if (userError) {
    return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 })
  }

  if (userData.role === 'admin') {
    return NextResponse.json({ success: true })
  }

  if (userData.status === 'rejected') {
    return NextResponse.json({ error: 'Your account has been rejected' }, { status: 403 })
  }

  if (!userData.is_active) {
    return NextResponse.json({ error: 'Your account is not active' }, { status: 403 })
  }

  if (userData.status === 'pending') {
    return NextResponse.json({ error: 'Your account is pending approval' }, { status: 403 })
  }

  // Check for missing team information
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .select('total_players, team_level')
    .eq('created_by', user.id)
    .single()

  if (teamError) {
    return NextResponse.json({ error: 'Error fetching team data' }, { status: 500 })
  }

  const needsTeamInfo = teamData.total_players === null || teamData.team_level === null

  return NextResponse.json({ success: true, needsTeamInfo })
}
