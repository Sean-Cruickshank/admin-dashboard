'use client'

import { useState } from 'react'
import { useContent } from '@/lib/queries/content'
import Link from 'next/link'
import { PAGE_SIZE } from '@/lib/constants/pagination'
import { usePathname, useSearchParams } from 'next/navigation'

type ContentTableProps = {
  userId: string,
  mode: 'all' | 'user' | 'approved',
  page: number
}

export default function ContentTable({ userId, mode, page } : ContentTableProps) {
  const [status, setStatus] = useState('all')
  const { data, isLoading, error } = useContent(status, userId, mode, page)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rows = data?.data ?? []
  const count = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  const pageParamKey = `${mode}Page`

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

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Error loading content</p>

  return (
    <div>
      {(mode === 'all' || mode === 'user') && <div>
        <button onClick={() => setStatus('all')}>All</button>
        <button onClick={() => setStatus('pending')}>Pending</button>
        <button onClick={() => setStatus('approved')}>Approved</button>
        <button onClick={() => setStatus('rejected')}>Rejected</button>
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