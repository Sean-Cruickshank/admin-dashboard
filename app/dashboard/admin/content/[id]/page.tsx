import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ReviewPanel from './ReviewPanel'

export default async function ReviewPage({ params }: { params: { id: string } }) {
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

  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !content) {
    redirect('/dashboard/admin')
  }

  return (
    <ReviewPanel
      content={content}
      userId={user.id}
    />
  )
}