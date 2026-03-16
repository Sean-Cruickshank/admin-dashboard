import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Content as C } from '@/app/types/Content'
import { PAGE_SIZE } from '../constants/pagination'

type Content = C & {
  profiles: { username: string } | null
}

export async function fetchContentByStatus(
  status: string,
  userId: string,
  mode: 'all' | 'approved' | 'user',
  page: number
) {
  const supabase = createSupabaseBrowserClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('content')
    .select('*, profiles!content_submitted_by_fkey (username)', { count: 'exact'})
    .order('created_at', { ascending: false })
    .range(from, to)

  if (mode === 'user') {
    query = query.eq('submitted_by', userId)
  }

  if (mode === 'approved') {
    query = query.eq('status', 'approved')
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) throw new Error(error.message)

  return {
    data: data as Content[],
    count: count ?? 0
  }
}

export function useContent(
  status: string,
  userId: string,
  mode: 'all' | 'approved' | 'user',
  page: number
) {
  return useQuery({
    queryKey: ['content', status, userId, mode, page],
    queryFn: () => fetchContentByStatus(status, userId, mode, page),
  })
}