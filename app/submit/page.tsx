import SubmissionForm from '@/app/components/SubmissionForm'

export default function SubmitPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Submit Content</h1>
        <p className="text-muted-foreground">
          Submit content for review. All submissions enter the moderation queue
          before they appear in the dashboard.
        </p>
      </div>

      <div className="mt-8">
        <SubmissionForm />
      </div>
    </main>
  )
}