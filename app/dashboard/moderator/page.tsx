import ContentTable from '@/app/components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

export default async function ModeratorDashboard() {
  const { user } = await requireRole(['admin', 'moderator'])

  return (
    <div className='dashboard-page'>
      <ContentTable userId={user.id} mode={'all'}/>
    </div>
  )
}