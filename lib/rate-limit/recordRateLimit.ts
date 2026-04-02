import { createSupabaseAdminClient } from '@/lib/supabase/admin'

type RecordRateLimitParams = {
  subjectType: 'user' | 'ip'
  subjectKey: string
  action: string
}

export async function recordRateLimit({
  subjectType, subjectKey, action
}: RecordRateLimitParams): Promise<void> {
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase.from('rate_limits').insert({
    subject_type: subjectType,
    subject_key: subjectKey,
    action,
  })

  if (error) {
    console.error('Error recording rate limit:', error)
    throw error
  }
}