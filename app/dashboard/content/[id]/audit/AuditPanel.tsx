'use client'

type Logs = {
  id: string,
  content_id: string,
  action: string,
  performed_by: string,
  performed_at: string,
  notes: string
}

export default function AuditPanel({ logs } : { logs: Logs[] }) {
  return (
    <div>
      {logs.map(log => (
        <p key={log.id}>{log.action}</p>
      ))}
    </div>
  )
}