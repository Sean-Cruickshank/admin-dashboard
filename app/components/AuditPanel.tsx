'use client'

import { useRouter } from "next/navigation"
import { Content } from "../types/Content"
import { Database } from '@/lib/database.types'

type AuditLog = Database['public']['Tables']['content_audit_logs']['Row']

type Logs = AuditLog & {
  profiles: { username: string } | null
}

type ContentPreview = Pick<Content, 'id' | 'title'>

export default function AuditPanel({ logs, content } : { logs: Logs[], content: ContentPreview }) {
  
  const router = useRouter()

  return (
    <div>
      <button onClick={() => router.back()}>Back</button>

      <h1>{content.title}</h1>

      <h2>Audit History</h2>
      {logs.map(log => (
        <div key={log.id}>
          <p>
            {log.action} by {log.profiles?.username} at {log.performed_at}
          </p>
          {log.notes && (
            <div>
              <p>Notes:</p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{log.notes}</p>
            </div>
          )}
        </div>
      ))}

    </div>
  )
}