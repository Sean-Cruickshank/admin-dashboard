'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useContent } from '@/lib/queries/content'
import { Status, Mode } from '@/app/types/Content'
import { handleRowClick, handleRowKeyDown } from '@/lib/helpers/handleRowClick'
import { useRouter } from 'next/navigation'

type ContentTableProps = { userId: string, mode: Mode }

export default function ContentTable({ userId, mode } : ContentTableProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  
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
  const currentPage = data?.currentPage ?? page
  const totalPages = data?.totalPages ?? 1
  
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages
  
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
    <div className='content-table'>
      
        <div className='table__filters'>
          {(mode === 'all' || mode === 'user') &&
            <>
              <h2>Filters:</h2>
              <div>
                <Link
                  className={status === 'all' ? 'active' : ''}
                  href={buildStatusHref('all')}>
                    View All
                </Link>

                <Link
                  className={status === 'pending' ? 'active' : ''}
                  href={buildStatusHref('pending')}>
                    Pending
                </Link>

                <Link
                  className={status === 'approved' ? 'active' : ''}
                  href={buildStatusHref('approved')}>
                    Approved
                </Link>

                <Link
                  className={status === 'rejected' ? 'active' : ''}
                  href={buildStatusHref('rejected')}>
                    Rejected
                </Link>
              </div>
            </>
          }
        </div>

      <div className='table__dashboard'>
        {mode === 'all' && <h2>Recent Submissions</h2>}
        {mode === 'user' && <h2>My Submissions</h2>}
        {mode === 'approved' && <h2>Latest Posts</h2>}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              {mode !== 'user' && <th>Submitted By</th>}
              <th>Created</th>
              {mode !== 'approved' && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map(item => (
                <tr
                  key={item.id}
                  className='table__row'
                  onClick={() => handleRowClick(item.id, router)}
                  onKeyDown={(e) => handleRowKeyDown(e, item.id, router)}
                  tabIndex={0}
                  role='link'
                  aria-label={`View content: ${item.title}`}
                >
                  <td>{item.title}</td>
                  {mode !== 'user' && <td>{item.profiles?.username || 'Unknown'}</td>}
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  {mode !== 'approved' &&
                    <td>
                      <div className={`status__${item.effective_status}`}>{item.effective_status}</div>
                    </td>
                  }
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={999}>No content found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className='table__pagination'>
          {hasPreviousPage
            ? <Link href={buildPageHref(currentPage - 1)}>Previous</Link>
            : <span>Previous</span>
          }

          <div className='page-count'>
            <span>Page {currentPage} of {totalPages}</span>
            <span>({count ?? 0} total items)</span>
          </div>

          {hasNextPage
            ? <Link href={buildPageHref(currentPage + 1)}>Next</Link>
            : <span>Next</span>
          }
        </div>
      </div>
    </div>
  )
}