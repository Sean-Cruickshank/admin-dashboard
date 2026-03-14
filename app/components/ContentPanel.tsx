'use client'

import { redirect, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Content as C } from '../types/Content'
import { useState } from 'react'

type Content = C & {
  profiles: { username: string } | null
}

type ContentPanelProps = {
  content: Content,
  userId: string,
  role: string
}

export default function ContentPanel({ content, userId, role } : ContentPanelProps) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [notes, setNotes] = useState('')

  const mutation = useMutation({
    mutationFn: async ({action, notes} : {action: "approved" | "rejected", notes: string}) => {
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
          notes: notes.trim() || null
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
      <button onClick={() => router.back()}>Back</button>
      <h1>{content.title}</h1>

      <p><strong>Status:</strong> {content.status}</p>
      <p><strong>Submitted By:</strong> {content.profiles?.username}</p>
      <p><strong>Created:</strong> {new Date(content.created_at).toLocaleString()}</p>

      <hr />

      <p>{content.body}</p>

      {content.status === 'pending' && (
        <div>
          <label htmlFor='moderation-notes'>Notes:</label>
          <textarea
            id='moderation-notes'
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={mutation.isPending}
            rows={4}
          />

          <button
            onClick={() => mutation.mutate({action: 'approved', notes})}
            disabled={mutation.isPending}>
            Approve
          </button>

          <button
            onClick={() => mutation.mutate({action: 'rejected', notes})}
            disabled={mutation.isPending}>
            Reject
          </button>
        </div>
      )}

      {role === 'admin' && <button
        onClick={() => router.push(`/dashboard/content/${content.id}/audit`)}
        >View Audit Logs
      </button>}
    </div>
  )
}