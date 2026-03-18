import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function requireUser() {

  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) redirect('/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profileError) redirect('/dashboard')

  if (!['admin', 'moderator', 'viewer'].includes(profile.role)) redirect('/login')

  return { supabase, user, profile }
}