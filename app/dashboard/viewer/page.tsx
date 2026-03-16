import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireUser } from '@/lib/auth/requireUser'

type ViewerDashboardProps = {
  searchParams: Promise<{ userPage?: string, approvedPage?: string }>
}

export default async function ViewerDashboard({ searchParams } : ViewerDashboardProps) {
  const { user } = await requireUser()

  const params = await searchParams
  const approvedPage = Math.max(1, Number(params.approvedPage)) || 1
  const userPage = Math.max(1, Number(params.userPage)) || 1

  return (
    <div>
      <h1>Viewer Dashboard</h1>
      <button>Submit Content</button>
      <ContentTable userId={user.id} mode={'user'} page={userPage} />
      <ContentTable userId={user.id} mode={'approved'} page={approvedPage} />
      <LogoutButton />
    </div>
  )
}