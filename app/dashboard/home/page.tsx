import ContentTable from '@/app/components/ContentTable'
import { requireUser } from '@/lib/auth/requireUser'

export default async function HomeDashboard() {
  const { user } = await requireUser()

  return (
    <div className='dashboard-page'>
      <ContentTable userId={user.id} mode={'user'}/>
      <ContentTable userId={user.id} mode={'approved'}/>
    </div>
  )
}