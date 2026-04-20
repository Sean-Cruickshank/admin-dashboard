'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ContentWithProfile } from '../types/Content'
import { moderateContent, type ModerateContentState } from '@/app/dashboard/content/[id]/action'

type ContentPanelProps = {
  content: ContentWithProfile
  role: string
}

const initialState: ModerateContentState = {
  success: false,
  message: '',
}

export default function ContentPanel({ content, role }: ContentPanelProps) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(moderateContent, initialState)

  const [notes, setNotes] = useState('')
  const [notesError, setNotesError] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<'approved' | 'rejected' | null>(null)

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard')
      router.refresh()
    }
  }, [state.success, router])

  function handleStatus(action: 'approved' | 'rejected') {
    const isOverride =
      content.effective_status !== 'pending' &&
      content.effective_status !== action

    if (isOverride && !notes.trim()) {
      setNotesError('Notes are required when overriding a previous decision.')
      return false
    }

    setNotesError(null)
    setSelectedAction(action)
    return true
  }

  return (
    <div>
      <button onClick={() => router.back()} disabled={pending}>
        Back
      </button>

      <h1>{content.title}</h1>

      <p><strong>Status:</strong> {content.effective_status}</p>
      <p><strong>Submitted By:</strong> {content.profiles?.username}</p>
      <p><strong>Created:</strong> {new Date(content.created_at).toLocaleString()}</p>
      <p>{content.body}</p>


      {(role === 'admin' || role === 'moderator') && (content.effective_status === 'pending' || role === 'admin') && (
        <>
          <hr />
          <form action={formAction}>
            <input type="hidden" name="contentId" value={content.id} />
            <input type="hidden" name="notes" value={notes} />

            <div>
              <label htmlFor="moderation-notes">Notes:</label>
              <textarea
                id="moderation-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={pending}
                rows={4}
              />
              {notesError && <p>{notesError}</p>}
            </div>

            {state.message && <div>{state.message}</div>}

            <button
              type="submit"
              name="action"
              value="approved"
              onClick={(e) => { if (!handleStatus('approved')) e.preventDefault()} } 
              disabled={pending || content.effective_status === 'approved'}
            >
              {pending && selectedAction === 'approved' ? 'Approving...' : 'Approve'}
            </button>

            <button
              type="submit"
              name="action"
              value="rejected"
              onClick={(e) => { if (!handleStatus('rejected')) e.preventDefault()} } 
              disabled={pending || content.effective_status === 'rejected'}
            >
              {pending && selectedAction === 'rejected' ? 'Rejecting...' : 'Reject'}
            </button>
          </form>
        </>
      )}

      {role === 'admin' && (
        <Link href={`/dashboard/content/${content.id}/audit`}>
          View Audit Logs
        </Link>
      )}
    </div>
  )
}