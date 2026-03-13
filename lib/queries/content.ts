import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Content as C } from '@/app/types/Content'

type Content = C & {
  profiles: { username: string } | null
}

export async function fetchContentByStatus(status: string, userId: string, mode: 'all' | 'approved' | 'user') {
  const supabase = createSupabaseBrowserClient()

  let query = supabase
    .from('content')
    .select('*, profiles!content_submitted_by_fkey (username)')
    .order('created_at', { ascending: false })

  if (mode === 'user') {
    query = query.eq('submitted_by', userId)
  }

  if (mode === 'approved') {
    query = query.eq('status', 'approved')
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data as Content[]
}

export function useContent(status: string, userId: string, mode: 'all' | 'approved' | 'user') {
  return useQuery({
    queryKey: ['content', status, userId, mode],
    queryFn: () => fetchContentByStatus(status, userId, mode),
  })
}