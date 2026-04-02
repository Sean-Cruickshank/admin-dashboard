'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { DEMO_ACCOUNTS, DEMO_LIFESPAN } from '@/lib/constants/demo'
import { checkRateLimit } from '@/lib/rate-limit/checkRateLimit'
import { recordRateLimit } from '@/lib/rate-limit/recordRateLimit'
import { RATE_LIMIT_ACTIONS, RATE_LIMIT_WINDOWS } from '@/lib/constants/rateLimit'

export type ModerateContentState = {
  success: boolean
  message: string
}

type ModerationAction = 'approved' | 'rejected'

export async function moderateContent(
  prevState: ModerateContentState,
  formData: FormData
): Promise<ModerateContentState> {
  const contentId = formData.get('contentId')
  const action = formData.get('action')
  const notes = formData.get('notes')

  if (
    typeof contentId !== 'string' ||
    (action !== 'approved' && action !== 'rejected') ||
    typeof notes !== 'string'
  ) {
    return {
      success: false,
      message: 'Invalid moderation request.',
    }
  }

  const moderationAction: ModerationAction = action
  const trimmedNotes = notes.trim()

  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      message: 'You must be signed in to moderate content.',
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return {
      success: false,
      message: 'Unable to verify your permissions.',
    }
  }

  if (profile.role !== 'moderator' && profile.role !== 'admin') {
    return {
      success: false,
      message: 'You do not have permission to moderate content.',
    }
  }

  const { data: content, error: contentError } = await supabase
    .from('content')
    .select('id, status, demo_override_status')
    .eq('id', contentId)
    .single()

  if (contentError || !content) {
    return {
      success: false,
      message: 'Unable to load content for moderation.',
    }
  }

  const effectiveStatus = content.demo_override_status ?? content.status
  const isOverride =
    effectiveStatus !== 'pending' && effectiveStatus !== moderationAction

  if (isOverride && !trimmedNotes) {
    return {
      success: false,
      message: 'Notes are required when overriding a previous decision.',
    }
  }

  const isRateLimited = await checkRateLimit({
    subjectType: 'user',
    subjectKey: user.id,
    action: RATE_LIMIT_ACTIONS.MODERATE_CONTENT,
    windowSeconds: RATE_LIMIT_WINDOWS.MODERATE_CONTENT_SECONDS,
  })

  if (isRateLimited) {
    return {
      success: false,
      message: `Please wait ${RATE_LIMIT_WINDOWS.MODERATE_CONTENT_SECONDS} seconds before moderating again.`,
    }
  }

  const isDemo = DEMO_ACCOUNTS.includes(user.id)

  if (isDemo) {
    const { error: updateError } = await supabase
      .from('content')
      .update({
        demo_override_status: moderationAction,
        demo_override_expires_at: new Date(Date.now() + DEMO_LIFESPAN).toISOString(),
      })
      .eq('id', contentId)

    if (updateError) {
      console.error('Error updating demo moderation status:', updateError)

      return {
        success: false,
        message: 'Something went wrong while moderating this content.',
      }
    }
  } else {
    const { error: updateError } = await supabase
      .from('content')
      .update({
        status: moderationAction,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        moderation_notes: trimmedNotes || null,
        demo_override_status: null,
        demo_override_expires_at: null,
      })
      .eq('id', contentId)

    if (updateError) {
      console.error('Error updating content moderation status:', updateError)

      return {
        success: false,
        message: 'Something went wrong while moderating this content.',
      }
    }
  }

  const { error: auditError } = await supabase
    .from('content_audit_logs')
    .insert({
      content_id: contentId,
      action: moderationAction,
      performed_by: user.id,
      notes: trimmedNotes || null,
    })

  if (auditError) {
    console.error('Error inserting moderation audit log:', auditError)
    throw auditError
  }

  await recordRateLimit({
    subjectType: 'user',
    subjectKey: user.id,
    action: RATE_LIMIT_ACTIONS.MODERATE_CONTENT,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/admin/audit')
  revalidatePath('/dashboard/moderator')
  revalidatePath('/dashboard/viewer')
  revalidatePath(`/dashboard/content/${contentId}`)
  revalidatePath(`/dashboard/content/${contentId}/audit`)

  return {
    success: true,
    message: `Content ${moderationAction} successfully.`,
  }
}