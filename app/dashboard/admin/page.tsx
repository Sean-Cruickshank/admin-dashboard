import ContentTable from '../../components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { user } = await requireRole(['admin'])

  return (
    <div className='dashboard-page'>
      <h1>Admin Dashboard</h1>
      <ContentTable userId={user.id} mode={'all'} />
    </div>
  )
}