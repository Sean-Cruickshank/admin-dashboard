import { Database } from '@/lib/database.types'

export type AuditSchema = Database['public']['Tables']['content_audit_logs']['Row']

export type Action = 'all' | 'submitted' | 'approved' | 'rejected'
export type DateRange = 'all' | '7' | '30'