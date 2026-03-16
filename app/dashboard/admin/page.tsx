import { redirect } from 'next/navigation'
import LogoutButton from '@/app/components/logoutButton'
import ContentTable from '../../components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'

type AdminDashboardProps = {
  searchParams: Promise<{ allPage?: string }>
}

export default async function AdminDashboard({ searchParams } : AdminDashboardProps) {
  const { user } = await requireRole(['admin'])

  const params = await searchParams
  const allPage = Math.max(1, Number(params.allPage)) || 1

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} page={allPage} />
      <LogoutButton />
    </div>
  )
}