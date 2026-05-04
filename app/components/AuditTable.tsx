'use client'

import { useAuditUsers, useAudit } from "@/lib/queries/audit";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Action, DateRange } from '@/app/types/Audit'
import { handleRowClick, handleRowKeyDown } from "@/lib/helpers/handleRowClick";
import { useRouter } from 'next/navigation'
import Pagination from "./Pagination";

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
    <div className="audit-table">
      <div className="table__filters">
        <div>
          <h3>Filter by User:</h3>
          <Link
            className={userId === 'all' ? 'active' : ''}
            href={buildFilterHref('all', 'userId')}
          >View All</Link>

          {isUsersLoading 
            ? <span>Loading users...</span>
            : usersError
              ? <span>Unable to load users</span>
              : users?.map(user => (
                  <Link
                    key={user.id}
                    className={userId === user.id ? 'active' : ''}
                    href={buildFilterHref(user.id, 'userId')}
                  >
                    {user.username}
                  </Link>
                ))
          }
        </div>

        <div>
          <h3>Filter by Action:</h3>
          <Link
            className={action === 'all' ? 'active' : ''}
            href={buildFilterHref('all', 'action')}
          >View All</Link>
          <Link
            className={action === 'submitted' ? 'active' : ''}
            href={buildFilterHref('submitted', 'action')}
          >Submitted</Link>
          <Link
            className={action === 'approved' ? 'active' : ''}
            href={buildFilterHref('approved', 'action')}
          >Approved</Link>
          <Link
            className={action === 'rejected' ? 'active' : ''}
            href={buildFilterHref('rejected', 'action')}
          >Rejected</Link>
        </div>

        <div>
          <h3>Filter by Date:</h3>
          <Link
            className={dateRange === 'all' ? 'active' : ''}
            href={buildFilterHref('all', 'dateRange')}
          >View All</Link>
          <Link
            className={dateRange === '7' ? 'active' : ''}
            href={buildFilterHref('7', 'dateRange')}
          >Last 7 Days</Link>
          <Link
            className={dateRange === '30' ? 'active' : ''}
            href={buildFilterHref('30', 'dateRange')}
          >Last 30 Days</Link>
        </div>
      </div>

      <div className="table__dashboard">
        <h1>Audit History</h1>
        <h2>Recent Submissions</h2>
        <table>
          <colgroup>
            <col style={{width: '25%'}}></col>
            <col style={{width: '10%'}}></col>
            <col style={{width: '20%'}}></col>
            <col style={{width: '15%'}}></col>
            <col style={{width: '30%'}}></col>
          </colgroup>
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
                <tr
                  key={item.id}
                  className="table__row"
                  onClick={() => handleRowClick(item.content_id, router)}
                  onKeyDown={(e) => handleRowKeyDown(e, item.content_id, router)}
                  tabIndex={0}
                  role='link'
                  aria-label={`View content: ${item.content?.title}`}
                >
                  <td>{item.content?.title}</td>
                  <td><div className={`status__${item.action}`}>{item.action}</div></td>
                  <td>{item.profiles?.username || 'Unknown'}</td>
                  <td>{new Date(item.performed_at).toLocaleString()}</td>
                  <td><div className="table__notes">{item.notes || '-'}</div></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          count={count}
          searchParams={searchParams}
          pathname={pathname}
        />

      </div>
    </div>
  )
}