'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Content = {
  id: string
  title: string
  body: string
  status: string
  submitted_by: string
  created_at: string
}

export default function ReviewPanel({ content, userId } : { content: Content, userId: string }) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (action: 'approved' | 'rejected') => {
      const { error: updateError } = await supabase
        .from('content')
        .update({ status: action })
        .eq('id', content.id)

      if (updateError) {
        console.error(updateError)
        throw updateError
      }

      const { error: auditError } = await supabase
        .from('content_audit_logs')
        .insert({
          content_id: content.id,
          action,
          performed_by: userId,
        })

      if (auditError) {
        console.error(auditError)
        throw(auditError)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      router.push('/dashboard')
      router.refresh()
    },
  })

  return (
    <div>
      <h1>{content.title}</h1>

      <p><strong>Status:</strong> {content.status}</p>
      <p><strong>Submitted By:</strong> {content.submitted_by}</p>
      <p><strong>Created:</strong> {new Date(content.created_at).toLocaleString()}</p>

      <hr />

      <p>{content.body}</p>

      {content.status === 'pending' && (
        <div>
          <button onClick={() => mutation.mutate('approved')} disabled={mutation.isPending}>
            Approve
          </button>

          <button onClick={() => mutation.mutate('rejected')} disabled={mutation.isPending}>
            Reject
          </button>
        </div>
      )}
    </div>
  )
}