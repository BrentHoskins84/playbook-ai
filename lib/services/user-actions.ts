import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updateProfile(user: User, updates: { full_name: string; email: string }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.updateUser({
    email: updates.email,
    data: { full_name: updates.full_name }
  })
  if (error) throw error

  // Update the users table
  const { error: profileError } = await supabase
    .from('users')
    .update({ full_name: updates.full_name })
    .eq('id', user.id)

  if (profileError) throw profileError

  return data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

