import { redirect } from 'next/navigation'
import AuditPanel from "@/app/components/AuditPanel";
import { requireRole } from "@/lib/auth/requireRole";

export default async function ContentAuditPage(props: { params: Promise<{ id: string }> }) {
  
  const { id } = await props.params
  const { supabase } = await requireRole(['admin'])

  const { data: content } = await supabase
    .from('content')
    .select('id, title')
    .eq('id', id)
    .single()

  if (!content) redirect('/dashboard')

  const { data: logs, error } = await supabase
    .from('content_audit_logs')
    .select(`*, profiles (username)`)
    .eq('content_id', id)
    .order('performed_at', { ascending: false })

  if (!logs || error) redirect('/dashboard')

  return <AuditPanel logs={logs} content={content} />
}