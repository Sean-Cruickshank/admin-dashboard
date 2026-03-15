import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireUser } from '@/lib/auth/requireUser'

type ViewerDashboardProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ViewerDashboard({ searchParams } : ViewerDashboardProps) {
  const { user } = await requireUser()

  const params = await searchParams
  const page = Math.max(1, Number(params.page)) || 1

  return (
    <div>
      <h1>Viewer Dashboard</h1>
      <button>Submit Content</button>
      <ContentTable userId={user.id} mode={'user'} page={page} />
      <ContentTable userId={user.id} mode={'approved'} page={page} />
      <LogoutButton />
    </div>
  )
}