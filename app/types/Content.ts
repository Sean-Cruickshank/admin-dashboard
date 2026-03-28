import { Database } from '@/lib/database.types'

type ContentSchema = Database['public']['Tables']['content']['Row']

export type Content = Pick<ContentSchema,
  'id' | 'title' | 'body' | 'status' | 'submitted_by' | 'created_at' | 'demo_override_status' | 'demo_override_expires_at'
>

export type Status = 'all' | 'pending' | 'approved' | 'rejected'

export type Mode = 'all' | 'user' | 'approved'
