import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { PAGE_SIZE } from "../constants/pagination";
import { AuditSchema, Action, DateRange } from '@/app/types/Audit'

type Audit = AuditSchema & { profiles: { username: string} | null, content: { title: string} | null}

function getDateCutoff(dateRange: DateRange): string | null {
  if (dateRange === 'all') return null

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - Number(dateRange))
  return cutoff.toISOString()
}

async function fetchContentAudit(
  userId: string,
  action: Action,
  dateRange: DateRange,
  page: number
) {
  const supabase = createSupabaseBrowserClient()

  const safeRequestedPage = Number.isInteger(page) && page > 0 ? page : 1
  const dateCutoff = getDateCutoff(dateRange)

  let countQuery = supabase
  .from('content_audit_logs')
  .select('*', { count: 'exact', head: true})

  if (userId && userId !== 'all') countQuery = countQuery.eq('performed_by', userId)

  if (action && action !== 'all') countQuery = countQuery.eq('action', action)

  if (dateCutoff) countQuery = countQuery.gte('performed_at', dateCutoff)

  const { count, error: countError } = await countQuery

  if (countError) throw countError

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(safeRequestedPage, totalPages)

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let auditQuery = supabase
    .from('content_audit_logs')
    .select(`
      *,
      profiles!content_audit_logs_performed_by_fkey (username),
      content!content_audit_logs_content_id_fkey (title)`)
    .order('performed_at', { ascending: false })
    .range(from, to)

  if (userId !== 'all') auditQuery = auditQuery.eq('performed_by', userId)

  if (action !== 'all') auditQuery = auditQuery.eq('action', action)

  if (dateCutoff) auditQuery = auditQuery.gte('performed_at', dateCutoff)

  const { data, error: auditError} = await auditQuery

  if (auditError) throw new Error(auditError.message)

  return {
    data: data as Audit[],
    count: totalCount,
    totalPages,
    currentPage
  }
}

export function useContentAudit(
  userId: string,
  action: Action,
  dateRange: DateRange,
  page: number
) {
  return useQuery({
    queryKey: ['content_audit_logs', userId, action, dateRange, page],
    queryFn: () => fetchContentAudit(userId, action, dateRange, page),
    placeholderData: (previousData) => previousData
  })
}

type AuditActor = {
  id: string
  username: string
  role: 'admin' | 'moderator'
}

async function fetchAuditActors() {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, role')
    .in('role', ['admin', 'moderator'])
    .order('role', { ascending: true })
    .order('username', { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []) as AuditActor[]
}

export function useAuditActors() {
  return useQuery({
    queryKey: ['audit_actors'],
    queryFn: fetchAuditActors,
    staleTime: 5 * 60 * 1000
  })
}