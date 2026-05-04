import { Database } from '@/lib/database.types'

type ContentSchema = Database['public']['Tables']['content']['Row']

export type Content = Pick<ContentSchema,
  | 'id'
  | 'title'
  | 'body'
  | 'status'
  | 'submitted_by'
  | 'reviewed_by'
  | 'created_at'
  | 'demo_override_status'
  | 'demo_override_expires_at'
> & { effective_status: 'pending' | 'approved' | 'rejected' }

export type ContentWithProfile = Content & { profiles: { username: string } | null }

export type ContentWithProfiles = Content & {
  submitted_by_profiles: { username: string } | null,
  reviewed_by_profiles: { username: string } | null
}

export type Status = 'pending' | 'approved' | 'rejected' | 'all'

export type Mode = 'all' | 'user' | 'approved'

