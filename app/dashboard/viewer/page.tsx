import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

export default async function ViewerPage() {
  const { user } = await requireRole(['admin', 'moderator', 'viewer'])

  return (
    <div>
      <h1>Viewer Dashboard</h1>
      <button>Submit Content</button>
      <ContentTable userId={user.id} mode={'user'} />
      <ContentTable userId={user.id} mode={'approved'} />
      <LogoutButton />
    </div>
  )
}