import { requireRole } from "@/lib/auth/requireRole";
import { redirect } from 'next/navigation'

export default async function GlobalAuditPage() {
  const { supabase } = await requireRole(['admin'])

  const { data: logs, error } = await supabase
    .from('content_audit_logs')
    .select(`
      *,
      profiles!content_audit_logs_performed_by_fkey (username),
      content!content_audit_logs_content_id_fkey (title')`)
    .order('performed_at', { ascending: false })

    if (!logs || error) redirect('/dashboard')
}