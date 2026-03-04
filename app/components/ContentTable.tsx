'use client'

import { useState } from 'react'
import { useContent } from '@/lib/queries/content'
import Link from 'next/link'

export default function ContentTable({ id } : { id: string }) {
  const [status, setStatus] = useState('all')
  const { data, isLoading, error } = useContent(status, id)

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Error loading content</p>

  return (
    <div>
      <div>
        <button onClick={() => setStatus('all')}>All</button>
        <button onClick={() => setStatus('pending')}>Pending</button>
        <button onClick={() => setStatus('approved')}>Approved</button>
        <button onClick={() => setStatus('rejected')}>Rejected</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Submitted By</th>
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
              <td>{item.status}</td>
              <td>{item.submitted_by}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}