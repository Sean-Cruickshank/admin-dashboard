import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

type Content = {
  id: string
  submitted_by: string
  title: string
  body: string
  status: string
  created_at: string
}

export async function fetchContentByStatus(status?: string) {
  const supabase = createSupabaseBrowserClient()

  let query = supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data as Content[]
}

export function useContent(status: string, id: string) {
  return useQuery({
    queryKey: ['content', status, id],
    queryFn: () => fetchContentByStatus(status),
  })
}