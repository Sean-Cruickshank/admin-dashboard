import { createServerSupabaseClient } from '@/lib/supabase/server'

type RateLimitParams = {
  subjectType: 'user' | 'ip'
  subjectKey: string
  action: string
  windowSeconds: number
}

export async function checkRateLimit({
  subjectType, subjectKey, action, windowSeconds
}: RateLimitParams): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  const cutoff = new Date(Date.now() - windowSeconds * 1000).toISOString()

  const { count, error } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('subject_type', subjectType)
    .eq('subject_key', subjectKey)
    .eq('action', action)
    .gte('created_at', cutoff)

  if (error) {
    console.error('Error checking rate limit:', error)
    throw error
  }

  return (count ?? 0) > 0
}