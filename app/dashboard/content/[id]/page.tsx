import { redirect } from 'next/navigation'
import ContentPanel from '@/app/components/ContentPanel'
import { requireUser } from '@/lib/auth/requireUser'
import { ContentWithProfile, Content } from '@/app/types/Content'

export default async function ReviewPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const { supabase, user, profile } = await requireUser()

  const { data: content, error } = await supabase
    .from('content_with_effective_status')
    .select('*, profiles!content_submitted_by_fkey (username)')
    .eq('id', id)
    .single()

  if (error || !content) redirect('/dashboard')

  if (content.expires_at && new Date(content.expires_at) <= new Date()) redirect('/dashboard')

  const typedContent: ContentWithProfile = {
    id: content.id!,
    title: content.title!,
    body: content.body!,
    status: content.status!,
    submitted_by: content.submitted_by,
    created_at: content.created_at!,
    demo_override_status: content.demo_override_status,
    demo_override_expires_at: content.demo_override_expires_at,
    effective_status: content.effective_status as Content['effective_status'],
    profiles: content.profiles,
  }

  return <ContentPanel content={typedContent} role={profile?.role} />
}