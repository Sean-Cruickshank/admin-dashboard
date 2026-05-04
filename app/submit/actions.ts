'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { contentSubmissionSchema } from '@/lib/validation/contentSubmission'
import { getSubmissionSubject } from '@/lib/rate-limit/getSubmissionSubject'
import { checkRateLimit } from '@/lib/rate-limit/checkRateLimit'
import { recordRateLimit } from '@/lib/rate-limit/recordRateLimit'
import { DEMO_ACCOUNTS, DEMO_LIFESPAN } from '@/lib/constants/demo'
import { RATE_LIMIT_ACTIONS, RATE_LIMIT_WINDOWS } from '@/lib/constants/rateLimit'

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

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const submittedBy: string | null = user ? user.id : null
  const contentId = crypto.randomUUID()
  const submissionSubject = await getSubmissionSubject(submittedBy)

  const isRateLimited = await checkRateLimit({
    subjectType: submissionSubject.subjectType,
    subjectKey: submissionSubject.subjectKey,
    action: RATE_LIMIT_ACTIONS.CREATE_SUBMISSION,
    windowSeconds: RATE_LIMIT_WINDOWS.CREATE_SUBMISSION_SECONDS,
  })

  if (isRateLimited) {
    return {
      success: false,
      message: 'Please wait 30 seconds before submitting again.',
    }
  }

  function handleDemoDetails(): { is_demo: boolean; expires_at: string | null } {
    const isDemo = user === null || DEMO_ACCOUNTS.includes(user.id)

    return {
      is_demo: isDemo,
      expires_at: isDemo
        ? new Date(Date.now() + DEMO_LIFESPAN).toISOString()
        : null
    };
  }

  const demoDetails = handleDemoDetails()

  const { error } = await supabase.from('content').insert({
    id: contentId,
    title: parsed.data.title,
    body: parsed.data.body,
    content_type: parsed.data.contentType,
    status: 'pending',
    submitted_by: submittedBy,
    submitter_subject_type: submissionSubject.subjectType,
    submitter_subject_key: submissionSubject.subjectKey,
    is_demo: demoDetails.is_demo,
    expires_at: demoDetails.expires_at
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

  await recordRateLimit({
    subjectType: submissionSubject.subjectType,
    subjectKey: submissionSubject.subjectKey,
    action: RATE_LIMIT_ACTIONS.CREATE_SUBMISSION,
  })

  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/admin/audit')
  revalidatePath('/dashboard/moderator')
  revalidatePath('/dashboard/home')

  return {
    success: true,
    message: 'Content submitted successfully and is now pending review.',
  }
}