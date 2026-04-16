import ContentTable from '@/app/components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

export default async function ModeratorDashboard() {
  const { user } = await requireRole(['admin', 'moderator'])

  return (
    <div className='dashboard-page'>
      <h1>Moderator Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'}/>
    </div>
  )
}