import { redirect } from 'next/navigation'
import ContentPanel from '@/app/components/ContentPanel'
import { requireRole } from '@/lib/auth/requireRole'

export default async function ReviewPage(props: { params: Promise<{ id: string }> }) {
  
  const { id } = await props.params
  const { supabase, user, profile } = await requireRole(['admin', 'moderator'])

  const { data: content, error } = await supabase
    .from('content')
    .select('*, profiles!content_submitted_by_fkey (username)')
    .eq('id', id)
    .single()

  if (error || !content) redirect('/dashboard')

  return <ContentPanel content={content} userId={user.id} role={profile?.role} />
}