import { redirect } from 'next/navigation'
import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '../../components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

export default async function AdminDashboard() {
  const { user } = await requireRole(['admin'])

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} />
      <LogoutButton />
    </div>
  )
}