import ContentTable from '../../components/ContentTable'
import { requireRole } from '@/lib/auth/requireRole'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { user } = await requireRole(['admin'])

  return (
    <div className='dashboard-page'>
      <ContentTable userId={user.id} mode={'all'} />
    </div>
  )
}