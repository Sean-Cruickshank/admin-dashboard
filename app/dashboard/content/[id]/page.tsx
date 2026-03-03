import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ReviewPanel from './ReviewPanel'

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

  if (!['admin', 'moderator'].includes(profile?.role)) redirect('/dashboard')

  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !content) redirect('/dashboard')

  return <ReviewPanel content={content} userId={user.id} />
}