import { useQuery } from '@tanstack/react-query'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { PAGE_SIZE } from '@/lib/constants/pagination'
import { ContentWithProfile, Status, Mode } from '@/app/types/Content'

export async function fetchContent(
  status: Status,
  userId: string,
  mode: Mode,
  page: number
) {
  const supabase = createSupabaseBrowserClient()

  const safeRequestedPage = Number.isInteger(page) && page > 0 ? page : 1
  const currentTime = new Date().toISOString()

  let countQuery = supabase
    .from('content_with_effective_status')
    .select('*', { count: 'exact', head: true})

  if (mode === 'user') {
    countQuery = countQuery.eq('submitted_by', userId)
  }
  if (mode === 'approved') {
    countQuery = countQuery.eq('effective_status', 'approved')
  } else if (status && status !== 'all') {
    countQuery = countQuery.eq('effective_status', status)
  }

  countQuery = countQuery.or(`expires_at.is.null,expires_at.gt.${currentTime}`)

  const { count, error: countError } = await countQuery

  if (countError) throw countError

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(safeRequestedPage, totalPages)

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let contentQuery = supabase
    .from('content_with_effective_status')
    .select('*, profiles!content_submitted_by_fkey (username)')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (mode === 'user') {
    contentQuery = contentQuery.eq('submitted_by', userId)
  }
  if (mode === 'approved') {
    contentQuery = contentQuery.eq('effective_status', 'approved')
  } else if (status && status !== 'all') {
    contentQuery = contentQuery.eq('effective_status', status)
  }

  contentQuery = contentQuery.or(`expires_at.is.null,expires_at.gt.${currentTime}`)

  const { data, error: contentError} = await contentQuery

  if (contentError) throw new Error(contentError.message)

  return {
    data: data as ContentWithProfile[],
    count: totalCount,
    currentPage,
    totalPages
  }
}

export function useContent(
  status: Status,
  userId: string,
  mode: Mode,
  page: number
) {
  return useQuery({
    queryKey: ['content', status, userId, mode, page],
    queryFn: () => fetchContent(status, userId, mode, page),
    placeholderData: (previousData) => previousData
  })
}