'use client'

import { useState } from 'react'
import { useContent } from '@/lib/queries/content'
import Link from 'next/link'

type ContentTableProps = {
  userId: string,
  mode: 'all' | 'user' | 'approved'
}

export default function ContentTable({ userId, mode } : ContentTableProps) {
  const [status, setStatus] = useState('all')
  const { data, isLoading, error } = useContent(status, userId, mode)

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Error loading content</p>

  console.log(data)

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
          {data?.map(item => (
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
    </div>
  )
}