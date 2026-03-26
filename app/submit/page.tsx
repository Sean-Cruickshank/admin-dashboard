import SubmissionForm from '@/app/components/SubmissionForm'

export default function SubmitPage() {
  return (
    <main>
      <div>
        <h1>Submit Content</h1>
        <p>
          All submissions must be approved before they can appear in the dashboard.
        </p>
      </div>

      <div>
        <SubmissionForm />
      </div>
    </main>
  )
}