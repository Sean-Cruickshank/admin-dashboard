import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/logoutButton'

export default async function ViewerPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'viewer') {
    redirect('/dashboard')
  }

  return (
      <div>
        <h1>Viewer Dashboard</h1>
        <LogoutButton />
      </div>
    )
}