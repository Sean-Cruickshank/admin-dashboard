'use client'

import { useContent } from '@/lib/queries/content'
import Link from 'next/link'
import { PAGE_SIZE } from '@/lib/constants/pagination'
import { usePathname, useSearchParams } from 'next/navigation'

type ContentTableProps = {
  userId: string,
  mode: 'all' | 'user' | 'approved'
}

type Status = 'all' | 'pending' | 'approved' | 'rejected'

export default function ContentTable({ userId, mode } : ContentTableProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const pageParamKey = `${mode}Page`
  const statusParamKey = `${mode}Status`
  
  const rawPage = Number(searchParams.get(pageParamKey))
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  
  const rawStatus = searchParams.get(statusParamKey)
  const status: Status = rawStatus === 'pending' || rawStatus === 'approved' || rawStatus === 'rejected'
    ? rawStatus
    : 'all'

  const { data, isLoading, error } = useContent(status, userId, mode, page)

  const rows = data?.data ?? []
  const count = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  
  const hasPreviousPage = page > 1
  const hasNextPage = page < totalPages
  
  function buildPageHref( newPage: number ) {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage <= 1) {
      params.delete(pageParamKey)
    } else {
      params.set(pageParamKey, String(newPage))
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  function buildStatusHref( newStatus: Status) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(pageParamKey)
    if (newStatus === 'all') {
      params.delete(statusParamKey)
    } else {
      params.set(statusParamKey, newStatus)
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Error loading content</p>

  return (
    <div>
      {(mode === 'all' || mode === 'user') && <div>
        <Link href={buildStatusHref('all')}>All</Link>
        <Link href={buildStatusHref('pending')}>Pending</Link>
        <Link href={buildStatusHref('approved')}>Approved</Link>
        <Link href={buildStatusHref('rejected')}>Rejected</Link>
      </div>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            {mode !== 'approved' && <th>Status</th>}
            {mode !== 'user' && <th>Submitted By</th>}
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(item => (
            <tr key={item.id}>
              <td>
                <Link href={`/dashboard/content/${item.id}`}>
                  {item.title}
                </Link>
              </td>
              {mode !== 'approved' && <td>{item.status}</td>}
              {mode !== 'user' && <td>{item.profiles?.username || 'Unknown'}</td>}
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {hasPreviousPage
          ? <Link href={buildPageHref(page - 1)}>Previous</Link>
          : <span>Previous</span>
        }

        <span>Page {page} of {totalPages}</span>

        {hasNextPage
          ? <Link href={buildPageHref(page + 1)}>Next</Link>
          : <span>Next</span>
        }
      </div>
    </div>
  )
}