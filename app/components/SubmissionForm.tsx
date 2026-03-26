'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitContent, SubmissionState } from '@/app/submit/actions'

const initialState: SubmissionState = {
  success: false,
  message: '',
}

export default function SubmissionForm() {
  const [state, formAction, pending] = useActionState(submitContent, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <form ref={formRef} action={formAction}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" placeholder="Enter a title" required />
        {state.fieldErrors?.title?.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </div>

      <div>
        <label htmlFor="contentType">Content Type</label>
        <select id="contentType" name="contentType" defaultValue="text">
          <option value="text">Text</option>
          <option value="link">Link</option>
        </select>
        {state.fieldErrors?.contentType?.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </div>

      <div>
        <label htmlFor="body">Content</label>
        <textarea
          id="body" name="body" rows={8} required
          placeholder="Enter the content you want reviewed"
        />
        {state.fieldErrors?.body?.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </div>

      {state.message && <div>{state.message}</div>}

      <button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit Content'}
      </button>
    </form>
  )
}