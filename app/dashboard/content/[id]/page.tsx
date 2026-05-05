import { redirect } from 'next/navigation'
import ContentPanel from '@/app/components/ContentPanel'
import { requireUser } from '@/lib/auth/requireUser'
import { Content, ContentWithProfiles } from '@/app/types/Content'

export default async function ReviewPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const { supabase, user, profile } = await requireUser()

  const { data: content, error } = await supabase
    .from('content_with_effective_status')
    .select(`
      *,
      submitted_by_profiles:profiles!content_submitted_by_fkey (username),
      reviewed_by_profiles:profiles!content_reviewed_by_fkey (username)
    `)
    .eq('id', id)
    .single()

  if (error || !content) redirect('/dashboard')

  if (content.expires_at && new Date(content.expires_at) <= new Date()) redirect('/dashboard')

  const typedContent: ContentWithProfiles = {
    id: content.id!,
    title: content.title!,
    body: content.body!,
    status: content.status!,
    submitted_by: content.submitted_by,
    reviewed_by: content.reviewed_by,
    created_at: content.created_at!,
    demo_override_status: content.demo_override_status,
    demo_override_expires_at: content.demo_override_expires_at,
    effective_status: content.effective_status as Content['effective_status'],
    submitted_by_profiles: content.submitted_by_profiles,
    reviewed_by_profiles: content.reviewed_by_profiles,
    moderation_notes: content.moderation_notes
  }

  return <ContentPanel content={typedContent} role={profile?.role} />
}