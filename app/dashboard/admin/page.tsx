import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/logoutButton'
import AdminTable from './AdminTable'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminTable />
      <LogoutButton />
    </div>
  )
}