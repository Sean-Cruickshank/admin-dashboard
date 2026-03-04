import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardLayout({children,}: {children: React.ReactNode}) {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase.from('profiles')
    .select('role').eq('id', user.id).single()
  
  if (!profile || error) redirect('/login')

  return <>{children}</>
}