'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { contentSubmissionSchema } from '@/lib/validation/contentSubmission'
import { z } from 'zod'

export type SubmissionState = {
  success: boolean
  message: string
  fieldErrors?: {
    title?: string[]
    body?: string[]
    contentType?: string[]
  }
}

export async function submitContent(
  prevState: SubmissionState,
  formData: FormData
): Promise<SubmissionState> {
  const parsed = contentSubmissionSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    contentType: formData.get('contentType'),
  })

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error)

    return {
      success: false,
      message: 'Please fix the form errors and try again.',
      fieldErrors: {
        title: flattened.fieldErrors.title,
        body: flattened.fieldErrors.body,
        contentType: flattened.fieldErrors.contentType,
      },
    }
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  let submittedBy: string | null = user ? user.id : null

  const contentId = crypto.randomUUID()

  const { error } = await supabase.from('content').insert({
    id: contentId,
    title: parsed.data.title,
    body: parsed.data.body,
    content_type: parsed.data.contentType,
    status: 'pending',
    submitted_by: submittedBy,
    // is_demo / expires_at intentionally left alone for now
  })

  if (error) {
    console.error('Error submitting content:', error)

    return {
      success: false,
      message: 'Something went wrong while submitting your content.',
    }
  }

  const { error: auditError } = await supabase
    .from('content_audit_logs')
    .insert({
      content_id: contentId,
      action: 'submitted',
      performed_by: submittedBy
    })

  if (auditError) {
    console.error(auditError)
    throw(auditError)
  }

  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/admin/audit')
  revalidatePath('/dashboard/moderator')
  revalidatePath('/dashboard/viewer')

  return {
    success: true,
    message: 'Content submitted successfully and is now pending review.',
  }
}