'use client'

import { redirect } from "next/navigation"
import { Content } from "../types/Content"

type Logs = {
  id: string,
  content_id: string,
  action: string,
  performed_by: string,
  performed_at: string,
  notes: string
}

type ContentPreview = Pick<Content, 'id' | 'title'>

export default function AuditPanel({ logs, content } : { logs: Logs[], content: ContentPreview }) {
  return (
    <div>
      <h1>{content.title}</h1>

      <h2>Audit History</h2>
      {logs.map(log => (
        <p key={log.id}>
          {log.action} by {log.performed_by} at {log.performed_at}
        </p>
      ))}

      <button onClick={() => redirect(`/dashboard/content/${content.id}`)}>Back</button>
    </div>
  )
}