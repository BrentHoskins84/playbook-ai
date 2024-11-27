import { createClient } from '@/lib/supabase/server'
import { is } from 'date-fns/locale'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, full_name, status')
    .eq('role', 'coach')
    .eq('status', 'pending')

  if (usersError) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }

  const coachesData = await Promise.all(users.map(async (user) => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(user.id)

    if (authError) {
      console.error("Error fetching auth user:", authError)
      return null
    }

    return {
      id: user.id,
      email: authUser?.email || '',
      name: user.full_name,
      team_name: authUser?.user_metadata.team_name || '',
      status: user.status
    }
  }))

  const validCoaches = coachesData.filter(coach => coach !== null)

  return NextResponse.json(validCoaches)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { id, action, teamId, teamName } = await request.json()

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (action === 'approve') {
    const { data: transaction, error: transactionError } = await supabase.rpc('begin_transaction')
    if (transactionError) {
      return NextResponse.json({ error: 'Failed to start transaction' }, { status: 500 })
    }

    try {
      let finalTeamId = teamId
      if (!teamId && teamName) {
        const { data: newTeam, error: newTeamError } = await supabase
          .from('teams')
          .insert({ team_name: teamName, is_active: false })
          .select('id')
          .single()

        if (newTeamError) throw newTeamError
        finalTeamId = newTeam.id
      }

      // Update user status
      const { error: updateError } = await supabase
        .from('users')
        .update({
          is_active: true,
          status: 'approved',
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Add entry to user_teams table
      const { error: userTeamError } = await supabase
        .from('user_teams')
        .insert({
          user_id: id,
          team_id: finalTeamId,
          role_in_team: 'coach'
        })

      if (userTeamError) throw userTeamError

      const { error: commitError } = await supabase.rpc('commit_transaction')
      if (commitError) throw commitError

      return NextResponse.json({ success: true, message: 'Coach approved and team assigned successfully' })
    } catch (error) {
      console.error('Error approving coach:', error)
      await supabase.rpc('rollback_transaction')
      return NextResponse.json({ error: 'Failed to approve coach and assign team' }, { status: 500 })
    }
  } else {
    // Reject action (remains unchanged)
    const { error } = await supabase
      .from('users')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to reject coach' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Coach rejected successfully' })
  }
}

