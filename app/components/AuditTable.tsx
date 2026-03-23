'use client'

import { useAuditUsers, useAudit } from "@/lib/queries/audit";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Action, DateRange } from '@/app/types/Audit'
import { useRouter } from "next/navigation"

type Filter = 'userId' | 'action' | 'dateRange'

export default function AuditTable() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const rawUserId = searchParams.get('userId')
  const userId = rawUserId ? rawUserId : 'all'

  const rawAction = searchParams.get('action')
  const action: Action = rawAction === 'submitted' || rawAction === 'approved' || rawAction === 'rejected'
    ? rawAction
    : 'all'

  const rawDateRange = searchParams.get('dateRange')
  const dateRange: DateRange = rawDateRange === '7' || rawDateRange === '30'
    ? rawDateRange
    : 'all'

  const rawPage = Number(searchParams.get('page'))
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1

  const { data, isLoading, error } = useAudit(userId, action, dateRange, page)

  const rows = data?.data ?? []
  const count = data?.count ?? 0
  const currentPage = data?.currentPage ?? page
  const totalPages = data?.totalPages ?? 1
  
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const { data: users, isLoading: isUsersLoading, error: usersError } = useAuditUsers()

  function buildPageHref( newPage: number ) {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(newPage))
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  function buildFilterHref( newValue: string, filter: Filter) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (newValue === 'all') {
      params.delete(filter)
    } else {
      params.set(filter, newValue)
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Error loading audit logs</p>

  return (
    <div>
      <button onClick={() => router.back()}>Back</button>
      <div>
        Filter by User:
        <Link href={buildFilterHref('all', 'userId')}>All</Link>
        {isUsersLoading ? (
          <span>Loading users...</span>
        ) : usersError ? (
          <span>Unable to load users</span>
        ) : (
          users?.map(user => (
            <Link key={user.id} href={buildFilterHref(user.id, 'userId')}>
              {user.username}
            </Link>
          ))
        )}
      </div>
      <div>
        Filter by Action:
        <Link href={buildFilterHref('all', 'action')}>All</Link>
        <Link href={buildFilterHref('submitted', 'action')}>Submitted</Link>
        <Link href={buildFilterHref('approved', 'action')}>Approved</Link>
        <Link href={buildFilterHref('rejected', 'action')}>Rejected</Link>
      </div>
      <div>
        Filter by Date:
        <Link href={buildFilterHref('all', 'dateRange')}>All</Link>
        <Link href={buildFilterHref('7', 'dateRange')}>Last 7 Days</Link>
        <Link href={buildFilterHref('30', 'dateRange')}>Last 30 Days</Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Action</th>
            <th>Performed By</th>
            <th>Performed At</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map(item => (
              <tr key={item.id}>
                <td>
                  <Link href={`/dashboard/content/${item.content_id}`}>
                    {item.content?.title}
                  </Link>
                </td>
                <td>{item.action}</td>
                <td>{item.profiles?.username || 'Unknown'}</td>
                <td>{new Date(item.performed_at).toLocaleString()}</td>
                <td>{item.notes || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No audit logs found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        {hasPreviousPage
          ? <Link href={buildPageHref(currentPage - 1)}>Previous</Link>
          : <span>Previous</span>
        }

        <span>Page {currentPage} of {totalPages} ({count} total items)</span>

        {hasNextPage
          ? <Link href={buildPageHref(currentPage + 1)}>Next</Link>
          : <span>Next</span>
        }
      </div>
    </div>
  )
}