'use client'

import { redirect } from "next/navigation"
import { Content } from "../types/Content"
import { Database } from '@/lib/database.types'

type AuditLog = Database['public']['Tables']['content_audit_logs']['Row']

type Logs = AuditLog & {
  profiles: { username: string } | null
}

type ContentPreview = Pick<Content, 'id' | 'title'>

export default function AuditPanel({ logs, content } : { logs: Logs[], content: ContentPreview }) {
  return (
    <div>
      <h1>{content.title}</h1>

      <h2>Audit History</h2>
      {logs.map(log => (
        <p key={log.id}>
          {log.action} by {log.profiles?.username} at {log.performed_at}
        </p>
      ))}

      <button onClick={() => redirect(`/dashboard/content/${content.id}`)}>Back</button>
    </div>
  )
}