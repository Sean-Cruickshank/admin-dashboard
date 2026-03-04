import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardEntry() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  switch (profile.role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'moderator':
      redirect('/dashboard/moderator')
    case 'viewer':
      redirect('/dashboard/viewer')
    default:
      redirect('/login')
  }
}