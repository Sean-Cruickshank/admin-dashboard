import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ContentPanel from '@/app/components/ContentPanel'

export default async function ReviewPage(props: { params: Promise<{ id: string }> }) {
  
  const { id } = await props.params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'moderator'].includes(profile?.role)) redirect('/dashboard')

  const { data: content, error } = await supabase
    .from('content')
    .select('*, profiles!content_submitted_by_fkey (username)')
    .eq('id', id)
    .single()

  if (error || !content) redirect('/dashboard')

  return <ContentPanel content={content} userId={user.id} role={profile?.role} />
}