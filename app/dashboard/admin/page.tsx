import { redirect } from 'next/navigation'
import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '../../components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

type AdminDashboardProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminDashboard({ searchParams } : AdminDashboardProps) {
  const { profile, user } = await requireRole(['admin'])

  const params = await searchParams
  const page = Math.max(1, Number(params.page)) || 1

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} page={page} />
      <LogoutButton />
    </div>
  )
}