'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ContentWithProfiles } from '../types/Content'
import { moderateContent, type ModerateContentState } from '@/app/dashboard/content/[id]/action'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import formatDate from '@/lib/helpers/formatDate'

type ContentPanelProps = {
  content: ContentWithProfiles
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
  const [moderationCollapse, setModerationCollapse] = useState(true)

  const formattedStatus = content.effective_status[0].toUpperCase() + content.effective_status.slice(1)
  const formattedBody = content.body.split(/\r?\n/).map(line => <p key={crypto.randomUUID()}>&nbsp;{line}</p>)

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
    <div className='content-panel'>
      <div className={moderationCollapse ? 'content-panel__content collapsed' : 'content-panel__content'}>
        <button onClick={() => router.back()} disabled={pending}>
          Back
        </button>

        <div className='content-panel__head'>
          <div className='content-panel__title'>
            <h1>{content.title}</h1>
          </div>
          <div className={`content-panel__status status__${content.effective_status}`}>
            {content.effective_status}
          </div>
          <i title={new Date(content.created_at).toLocaleString()}>
            -- {formatDate(content.created_at)} --
          </i>
          <p>
            {content.submitted_by_profiles?.username
              ? `Submitted by: ${content.submitted_by_profiles?.username}`
              : 'Submitted Anonymously'
            }
          </p>
        </div>

        <div className='content-panel__body'>
          {formattedBody}
        </div>
        <div className='content-panel__moderation-notes'>
          {content.moderation_notes}
        </div>
      </div>

      {(role === 'admin' || role === 'moderator') && (content.effective_status === 'pending' || role === 'admin') && (
        <>
          <div className={moderationCollapse ? 'moderation-form collapsed' : 'moderation-form'}>
            <div className='moderation-form__content'>
              <h2>Moderation Settings</h2>
              {role === 'admin' && (
                <Link href={`/dashboard/content/${content.id}/audit`}>
                  View Post Audit History
                </Link>
              )}
              <p className='content-id'>({content.id})</p>
              <p><strong>Status: </strong>{content.effective_status}</p>
              {content.effective_status !== 'pending' &&
                <p><strong>{formattedStatus} by: </strong>{content.reviewed_by_profiles?.username}</p>
              }

              <form action={formAction}>
                <input type="hidden" name="contentId" value={content.id} />
                <input type="hidden" name="notes" value={notes} />

                <div className='moderation-form__notes'>
                  <textarea
                    className={notesError ? 'notes-error' : ''}
                    placeholder='Moderation notes'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={pending}
                    rows={4}
                  />
                  {notesError && <p>{notesError}</p>}
                </div>

                {state.message && <div>{state.message}</div>}

                <div className='moderation-form__buttons'>
                  <button
                    type="submit"
                    name="action"
                    value="approved"
                    className={content.effective_status === 'approved' ? 'disabled' : ''}
                    onClick={(e) => { if (!handleStatus('approved')) e.preventDefault()} } 
                    disabled={pending || content.effective_status === 'approved'}
                    >
                    {pending && selectedAction === 'approved' ? 'Approving...' : 'Approve'}
                  </button>

                  <button
                    type="submit"
                    name="action"
                    value="rejected"
                    className={content.effective_status === 'rejected' ? 'disabled' : ''}
                    onClick={(e) => { if (!handleStatus('rejected')) e.preventDefault()} } 
                    disabled={pending || content.effective_status === 'rejected'}
                  >
                    {pending && selectedAction === 'rejected' ? 'Rejecting...' : 'Reject'}
                  </button>

                </div>
              </form>
            </div>

          </div>
            <button
              onClick={() => setModerationCollapse(prev => !prev)}
              className={moderationCollapse ? 'moderation-form__toggle collapsed' : 'moderation-form__toggle'}>
              {moderationCollapse ? <FiChevronLeft /> : <FiChevronRight />}
            </button>
        </>
      )}

    </div>
  )
}