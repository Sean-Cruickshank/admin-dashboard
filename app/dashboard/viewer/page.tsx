import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '@/app/components/ContentTable'
import { requireUser } from '@/lib/auth/requireUser'

export default async function ViewerDashboard() {
  const { user } = await requireUser()

  return (
    <div>
      <h1>Viewer Dashboard</h1>

      <button>Submit Content</button>

      <ContentTable userId={user.id} mode={'user'}/>
      <ContentTable userId={user.id} mode={'approved'}/>
      
      <LogoutButton />
    </div>
  )
}