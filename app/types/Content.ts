import { Database } from '@/lib/database.types'

type ContentSchema = Database['public']['Tables']['content']['Row']

export type Content = Pick<ContentSchema,
  'id' | 'title' | 'body' | 'status' | 'submitted_by' | 'created_at'
>
