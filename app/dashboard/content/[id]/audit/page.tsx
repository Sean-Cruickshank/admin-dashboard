import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import AuditPanel from "@/app/components/AuditPanel";

export default async function AuditPage(props: { params: Promise<{ id: string }> }) {
  
  const { id } = await props.params
  const supabase = await createServerSupabaseClient()

  const { data : { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: content } = await supabase
    .from('content')
    .select('id, title')
    .eq('id', id)
    .single()

  if (!content) redirect('/dashboard')

  const { data: logs, error } = await supabase
    .from('content_audit_logs')
    .select('*')
    .eq('content_id', id)
    .order('performed_at', { ascending: false })

  if (!logs || error) redirect('/dashboard')

  return <AuditPanel logs={logs} content={content} />
}