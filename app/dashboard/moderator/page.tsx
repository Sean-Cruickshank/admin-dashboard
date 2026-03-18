import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

export default async function ModeratorDashboard() {
  const { user } = await requireRole(['admin', 'moderator'])

  return (
    <div>
      <h1>Moderator Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'}/>
      <LogoutButton />
    </div>
  )
}