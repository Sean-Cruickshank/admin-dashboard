import ContentTable from '@/app/components/ContentTable'
import { requireUser } from '@/lib/auth/requireUser'

export default async function ViewerDashboard() {
  const { user } = await requireUser()

  return (
    <div className='dashboard-page'>
      <h1>Viewer Dashboard</h1>
      <ContentTable userId={user.id} mode={'user'}/>
      <ContentTable userId={user.id} mode={'approved'}/>
    </div>
  )
}