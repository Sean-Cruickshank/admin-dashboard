import ContentTable from '../../components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { user } = await requireRole(['admin'])

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Link href={'/dashboard/admin/audit'}>View Audit History</Link>
      <ContentTable userId={user.id} mode={'all'} />
    </div>
  )
}