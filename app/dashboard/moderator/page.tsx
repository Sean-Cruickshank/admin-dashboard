import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'

export default async function ModeratorPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'moderator') {
    redirect('/dashboard')
  }

  return (
    <div>
      <h1>Moderator Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} />
      <LogoutButton />
    </div>
  )
}